from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from models.datve import DatVe
from pyspark.sql import functions as F
from pyspark.sql.functions import from_json, explode, col, when, array
from pyspark.sql.types import ArrayType, StringType
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import datetime, date
import uuid
import json

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
dat_ve_collection = db["datve"]


@router.post("", tags=["datve"])
def add_dat_ve(dat_ve: DatVe):
    try:

        print(f"Nhận yêu cầu POST /add: {dat_ve.ma_dat_ve}")
        print("🚀 Dữ liệu nhận được từ client:", dat_ve.dict())

        df_dat_ve = load_df("datve")
        df_khach_hang = load_df("khachhang")
        df_hang_ve = load_df("hangve")
        df_chuyen_bay = load_df("chuyenbay")

        # ✅ Kiểm tra mã khách hàng
        if (
            df_khach_hang.filter(
                df_khach_hang.ma_khach_hang == dat_ve.ma_khach_hang
            ).count()
            == 0
        ):
            raise HTTPException(status_code=400, detail="Mã khách hàng không tồn tại")

        # 👉 Chuẩn hóa về dạng list
        ma_chuyen_bay_list = (
            dat_ve.ma_chuyen_bay
            if isinstance(dat_ve.ma_chuyen_bay, list)
            else [dat_ve.ma_chuyen_bay]
        )
        ma_hang_ve_list = (
            dat_ve.ma_hang_ve
            if isinstance(dat_ve.ma_hang_ve, list)
            else [dat_ve.ma_hang_ve]
        )

        # ✅ Validation mã chuyến bay
        for ma_cb in ma_chuyen_bay_list:
            if df_chuyen_bay.filter(df_chuyen_bay.ma_chuyen_bay == ma_cb).count() == 0:
                raise HTTPException(
                    status_code=400, detail=f"Mã chuyến bay không tồn tại: {ma_cb}"
                )

        # ✅ Validation mã hạng vé
        for ma_hv in ma_hang_ve_list:
            if df_hang_ve.filter(df_hang_ve.ma_hang_ve == ma_hv).count() == 0:
                raise HTTPException(
                    status_code=400, detail=f"Mã hạng vé không tồn tại: {ma_hv}"
                )

        # 🆕 Sinh mã đặt vé nếu chưa có
        ma_dat_ve = dat_ve.ma_dat_ve or f"DV{uuid.uuid4().hex[:8].upper()}"

        # 💡 Kiểm tra trùng mã
        if "ma_dat_ve" in df_dat_ve.columns:
            if df_dat_ve.filter(df_dat_ve["ma_dat_ve"] == ma_dat_ve).count() > 0:
                raise HTTPException(status_code=400, detail="Mã đặt vé đã tồn tại")

        # 🔄 Chuẩn bị dữ liệu để insert
        data_to_insert = dat_ve.dict()
        data_to_insert["ma_dat_ve"] = ma_dat_ve

        # Xử lý datetime
        if isinstance(data_to_insert["ngay_dat"], date):
            data_to_insert["ngay_dat"] = datetime.combine(
                data_to_insert["ngay_dat"], datetime.min.time()
            )

        # 📥 Ghi vào MongoDB
        insert_result = dat_ve_collection.insert_one(data_to_insert)
        invalidate_cache("datve")

        # ✅ Chuẩn bị dữ liệu trả về
        data_to_insert["_id"] = str(insert_result.inserted_id)
        data_to_insert["ngay_dat"] = data_to_insert["ngay_dat"].isoformat()

        print("✅ Đặt vé thành công:", ma_dat_ve)
        return JSONResponse(
            content={"message": "Thêm đặt vé thành công", "datve": data_to_insert}
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["dat_ve"])
def get_existing_dat_ve(
    ma_khach_hang: str = Query(...),
    loai_chuyen_di: str = Query(None),  # Optional cho new format
):
    try:
        # ✅ Tìm kiếm linh hoạt - ưu tiên fields mới
        search_criteria = {"ma_khach_hang": ma_khach_hang}

        if loai_chuyen_di:
            search_criteria["loai_chuyen_di"] = loai_chuyen_di

        result = dat_ve_collection.find_one(
            search_criteria,
            sort=[("ngay_dat", -1)],  # Ưu tiên bản ghi gần nhất
        )

        if not result:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi đặt vé")

        return {
            "ma_dat_ve": result["ma_dat_ve"],
            "dat_ve": {
                "ma_khach_hang": result["ma_khach_hang"],
                "loai_chuyen_di": result.get("loai_chuyen_di", "Một chiều"),
                "ma_chuyen_di": result.get("ma_chuyen_di"),  # Backward compatibility
                "ngay_dat": (
                    result["ngay_dat"].isoformat()
                    if isinstance(result["ngay_dat"], datetime)
                    else result["ngay_dat"]
                ),
                "ma_dat_ve": result["ma_dat_ve"],
                "ma_hang_ve_di": result.get("ma_hang_ve_di"),
                "ma_chuyen_bay_di": result.get("ma_chuyen_bay_di"),
                "ma_hang_ve_ve": result.get("ma_hang_ve_ve"),
                "ma_chuyen_bay_ve": result.get("ma_chuyen_bay_ve"),
                "trang_thai": result.get("trang_thai", "Đang xử lý"),
            },
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi get_existing_dat_ve:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/all", tags=["dat_ve"])
def get_all_dat_ve_by_user(ma_khach_hang: str = Query(...)):
    try:
        spark = load_df("datve").sparkSession

        # 1️⃣ Load các bảng liên quan
        df_datve = load_df("datve")
        df_chitiet = load_df("chitietdatve")
        df_ve = load_df("ve")
        df_hangve = load_df("hangve")
        df_cb = load_df("chuyenbay")
        df_sb = load_df("sanbay")
        df_hk = load_df("hanhkhach")

        # 2️⃣ Explode ma_ve nếu cần
        if dict(df_chitiet.dtypes)["ma_ve"] != "array<string>":
            df_chitiet = df_chitiet.withColumn(
                "ma_ve_array",
                when(
                    col("ma_ve").startswith("["),
                    from_json("ma_ve", ArrayType(StringType())),
                ).otherwise(F.array("ma_ve")),
            )
            df_chitiet = df_chitiet.withColumn("ma_ve", explode("ma_ve_array")).drop(
                "ma_ve_array"
            )
        else:
            df_chitiet = df_chitiet.withColumn("ma_ve", explode("ma_ve"))

        # 3️⃣ Explode ma_hanh_khach nếu nó là array
        if dict(df_chitiet.dtypes)["ma_hanh_khach"] == "array<string>":
            df_chitiet = df_chitiet.withColumn(
                "ma_hanh_khach", explode("ma_hanh_khach")
            )

        # 4️⃣ Tạo view cho Spark SQL
        df_datve.createOrReplaceTempView("datve")
        df_chitiet.createOrReplaceTempView("chitietdatve")
        df_ve.createOrReplaceTempView("ve")
        df_hangve.createOrReplaceTempView("hangve")
        df_cb.createOrReplaceTempView("chuyenbay")
        df_sb.createOrReplaceTempView("sanbay")
        df_hk.createOrReplaceTempView("hanhkhach")

        # 5️⃣ Truy vấn chi tiết vé + hành khách
        query = f"""
        SELECT
            dv.ma_dat_ve,
            dv.ngay_dat,
            dv.trang_thai,
            dv.loai_chuyen_di,
            dv.ma_khach_hang,
            ctdv.ma_ve,
            ctdv.ma_hanh_khach,
            hk.danh_xung,
            hk.ho_hanh_khach,
            hk.ten_hanh_khach,
            hk.ngay_sinh,
            v.ma_chuyen_bay,
            v.ma_hang_ve,
            hv.ten_hang_ve,
            cb.thoi_gian_di,
            cb.thoi_gian_den,
            sb_di.ten_san_bay AS ten_san_bay_di,
            sb_den.ten_san_bay AS ten_san_bay_den
        FROM datve dv
        LEFT JOIN chitietdatve ctdv ON dv.ma_dat_ve = ctdv.ma_dat_ve
        LEFT JOIN ve v ON ctdv.ma_ve = v.ma_ve
        LEFT JOIN hangve hv ON v.ma_hang_ve = hv.ma_hang_ve
        LEFT JOIN chuyenbay cb ON v.ma_chuyen_bay = cb.ma_chuyen_bay
        LEFT JOIN sanbay sb_di ON cb.ma_san_bay_di = sb_di.ma_san_bay
        LEFT JOIN sanbay sb_den ON cb.ma_san_bay_den = sb_den.ma_san_bay
        LEFT JOIN hanhkhach hk ON ctdv.ma_hanh_khach = hk.ma_hanh_khach
        WHERE dv.ma_khach_hang = '{ma_khach_hang}'
        """
        df = spark.sql(query)

        # 6️⃣ Gom hành khách theo từng vé
        df_grouped_ve = df.groupBy(
            "ma_dat_ve",
            "ma_khach_hang",
            "ma_ve",
            "ma_chuyen_bay",
            "ma_hang_ve",
            "ten_hang_ve",
            "thoi_gian_di",
            "thoi_gian_den",
            "ten_san_bay_di",
            "ten_san_bay_den",
        ).agg(
            F.collect_list(
                F.struct(
                    "ma_hanh_khach",
                    "danh_xung",
                    "ho_hanh_khach",
                    "ten_hanh_khach",
                    "ngay_sinh",
                )
            ).alias("danh_sach_hanh_khach")
        )

        # 7️⃣ Gom vé theo đơn đặt vé, giữ ma_khach_hang để tránh nhầm khách
        df_grouped_datve = df_grouped_ve.groupBy("ma_dat_ve", "ma_khach_hang").agg(
            F.collect_list(
                F.struct(
                    "ma_ve",
                    "ma_chuyen_bay",
                    "ma_hang_ve",
                    "ten_hang_ve",
                    "thoi_gian_di",
                    "thoi_gian_den",
                    "ten_san_bay_di",
                    "ten_san_bay_den",
                    "danh_sach_hanh_khach",
                )
            ).alias("chi_tiet_ve_dat")
        )

        # 8️⃣ Join lại với df_datve đã lọc ma_khach_hang
        df_datve_filtered = df_datve.filter(col("ma_khach_hang") == ma_khach_hang)
        final_df = df_datve_filtered.join(
            df_grouped_datve, on="ma_dat_ve", how="left"
        ).orderBy(F.col("ngay_dat").desc())

        invalidate_cache("datve")
        
        # 9️⃣ Trả dữ liệu JSON về FE
        return [json.loads(row) for row in final_df.toJSON().collect()]

    except Exception as e:
        print("❌ Lỗi Spark SQL:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# @router.delete("/delete-all", tags=["dat_ve"])
# def delete_all_dat_ve():
#     """Xóa tất cả dữ liệu đặt vé - CHỈ DÙNG ĐỂ TEST"""
#     try:
#         # Xóa tất cả records trong collection dat_ve
#         result = dat_ve_collection.delete_many({})

#         # Invalidate cache
#         refresh_cache("dat_ve")

#         print(f"🗑️ Đã xóa tất cả {result.deleted_count} records đặt vé")
#         return JSONResponse(
#             content={
#                 "message": f"Đã xóa tất cả dữ liệu đặt vé thành công",
#                 "deleted_count": result.deleted_count,
#             }
#         )

#     except Exception as e:
#         print("❌ Lỗi khi xóa tất cả đặt vé:", e)
#         raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ✅ Hybrid approach: Dùng Spark để validate + MongoDB để update
@router.patch("/{ma_dat_ve}/refund", tags=["dat_ve"])
def request_refund_ticket_hybrid(ma_dat_ve: str):
    try:
        # Load các DataFrame cần thiết
        df_datve = load_df("datve")
        df_ctdv = load_df("chitietdatve")
        df_ve = load_df("ve")
        df_hangve = load_df("hangve")

        # ✅ Fix lỗi array<string> bằng explode trước khi join
        if dict(df_ctdv.dtypes)["ma_ve"] == "array<string>":
            df_ctdv = df_ctdv.withColumn("ma_ve", F.explode("ma_ve"))

        # Tạo view cho Spark SQL
        df_datve.createOrReplaceTempView("datve")
        df_ctdv.createOrReplaceTempView("chitietdatve")
        df_ve.createOrReplaceTempView("ve")
        df_hangve.createOrReplaceTempView("hangve")

        # Query vé
        query = f"""
        SELECT dv.ma_dat_ve, dv.trang_thai, dv.ma_khach_hang,
               v.ma_hang_ve, hv.ten_hang_ve, hv.refundable, v.gia_ve
        FROM datve dv
        LEFT JOIN chitietdatve ctdv ON dv.ma_dat_ve = ctdv.ma_dat_ve
        LEFT JOIN ve v ON ctdv.ma_ve = v.ma_ve
        LEFT JOIN hangve hv ON v.ma_hang_ve = hv.ma_hang_ve
        WHERE dv.ma_dat_ve = '{ma_dat_ve}'
        """

        spark = df_datve.sparkSession
        results = spark.sql(query).collect()

        if not results:
            raise HTTPException(status_code=404, detail="Không tìm thấy mã đặt vé")

        ticket_info = results[0]

        # Kiểm tra trạng thái vé
        if ticket_info["trang_thai"] != "Đã thanh toán":
            raise HTTPException(
                status_code=400,
                detail=f"Chỉ hoàn vé đã thanh toán. Trạng thái hiện tại: {ticket_info['trang_thai']}",
            )

        # Kiểm tra điều kiện hoàn vé
        if ticket_info["refundable"] is not None and not ticket_info["refundable"]:
            raise HTTPException(
                status_code=400,
                detail=f"Hạng vé {ticket_info['ten_hang_ve']} không được phép hoàn vé",
            )

        # Tính số tiền hoàn (90%)
        gia_ve_hoan = int(ticket_info["gia_ve"] * 0.9)

        # Cập nhật trạng thái trong MongoDB
        update_result = dat_ve_collection.update_one(
            {"ma_dat_ve": ma_dat_ve},
            {
                "$set": {
                    "trang_thai": "Chờ duyệt hoàn vé",
                    "ngay_yeu_cau_hoan": datetime.now(),
                    "gia_ve_hoan": gia_ve_hoan,
                    "trang_thai_duyet": "Chờ xử lý",
                    "admin_xem": False,
                }
            },
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Không thể cập nhật trạng thái")

        invalidate_cache("datve")

        return JSONResponse(
            content={
                "message": "Yêu cầu hoàn vé thành công",
                "ma_dat_ve": ma_dat_ve,
                "trang_thai_moi": "Chờ duyệt hoàn vé",
                "so_tien_hoan": gia_ve_hoan,
            }
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi hybrid refund request:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



@router.patch("/{ma_dat_ve}/approve-refund", tags=["admin"])
def approve_refund(ma_dat_ve: str, approved: bool = Query(...)):
    try:
        # 🔍 Tìm thông tin vé
        ticket_doc = dat_ve_collection.find_one({"ma_dat_ve": ma_dat_ve})
        if not ticket_doc:
            raise HTTPException(status_code=404, detail="Không tìm thấy mã đặt vé")

        # 🛑 Chỉ xử lý nếu vé đang chờ duyệt hoàn vé
        if ticket_doc.get("trang_thai") != "Chờ duyệt hoàn vé":
            raise HTTPException(
                status_code=400,
                detail=f"Vé không ở trạng thái chờ duyệt. Trạng thái hiện tại: {ticket_doc.get('trang_thai')}",
            )

        # ✅ Nếu DUYỆT
        if approved:
            new_status = "Đã hoàn vé"
            update_data = {
                "trang_thai": new_status,
                "trang_thai_duyet": "Đã duyệt",
                "ngay_duyet_hoan": datetime.now(),
                "ngay_hoan_ve": datetime.now(),
                "admin_duyet": "SYSTEM",
                "so_tien_hoan": ticket_doc.get("gia_ve_hoan", 1500000),
            }
        else:
            # ❌ Nếu TỪ CHỐI
            new_status = "Đã thanh toán"
            update_data = {
                "trang_thai": new_status,
                "trang_thai_duyet": "Từ chối",
                "ngay_duyet_hoan": datetime.now(),
                "admin_duyet": "SYSTEM",
                "ly_do_tu_choi": "Admin từ chối yêu cầu hoàn vé",
            }

        # 💾 Update vé
        dat_ve_collection.update_one(
            {"ma_dat_ve": ma_dat_ve},
            {"$set": update_data}
        )

        # Nếu từ chối thì xóa field liên quan
        if not approved:
            dat_ve_collection.update_one(
                {"ma_dat_ve": ma_dat_ve},
                {
                    "$unset": {
                        "ngay_yeu_cau_hoan": "",
                        "gia_ve_hoan": "",
                        "nguoi_yeu_cau": "",
                        "admin_xem": "",
                    }
                }
            )

        # 🔄 Refresh Spark cache
        invalidate_cache("datve")

        return JSONResponse(
            content={
                "message": f"{'Duyệt' if approved else 'Từ chối'} hoàn vé thành công",
                "approved": approved,
                "new_status": new_status,
                "so_tien_hoan": update_data.get("so_tien_hoan", 0),
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Lỗi approve refund: {e}")
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

# @router.get("", tags=["dat_ve"])
# def get_existing_dat_ve(
#     ma_khach_hang: str = Query(...),
#     loai_chuyen_di: str = Query(None),  # Optional cho new format
# ):
#     try:
#         # ✅ Tìm kiếm linh hoạt - ưu tiên fields mới
#         search_criteria = {"ma_khach_hang": ma_khach_hang}

#         if loai_chuyen_di:
#             search_criteria["loai_chuyen_di"] = loai_chuyen_di

#         result = dat_ve_collection.find_one(
#             search_criteria,
#             sort=[("ngay_dat", -1)],  # Ưu tiên bản ghi gần nhất
#         )

#         if not result:
#             raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi đặt vé")

#         return {
#             "ma_dat_ve": result["ma_dat_ve"],
#             "dat_ve": {
#                 "ma_khach_hang": result["ma_khach_hang"],
#                 "loai_chuyen_di": result.get("loai_chuyen_di", "Một chiều"),
#                 "ma_chuyen_di": result.get("ma_chuyen_di"),  # Backward compatibility
#                 "ngay_dat": (
#                     result["ngay_dat"].isoformat()
#                     if isinstance(result["ngay_dat"], datetime)
#                     else result["ngay_dat"]
#                 ),
#                 "ma_dat_ve": result["ma_dat_ve"],
#                 "ma_hang_ve_di": result.get("ma_hang_ve_di"),
#                 "ma_chuyen_bay_di": result.get("ma_chuyen_bay_di"),
#                 "ma_hang_ve_ve": result.get("ma_hang_ve_ve"),
#                 "ma_chuyen_bay_ve": result.get("ma_chuyen_bay_ve"),
#                 "trang_thai": result.get("trang_thai", "Đang xử lý"),
#             },
#         }

#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         print("❌ Lỗi get_existing_dat_ve:", e)
#         raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# @router.delete("/{ma_dat_ve}", tags=["dat_ve"])
# def cancel_dat_ve(ma_dat_ve: str):
#     try:
#         # Tìm bản ghi đặt vé
#         result = dat_ve_collection.find_one({"ma_dat_ve": ma_dat_ve})
#         if not result:
#             raise HTTPException(status_code=404, detail="Không tìm thấy mã đặt vé")

#         # Cập nhật trạng thái sang "Đã hủy"
#         update_result = dat_ve_collection.update_one(
#             {"ma_dat_ve": ma_dat_ve}, {"$set": {"trang_thai": "Đã hủy"}}
#         )

#         if update_result.modified_count == 0:
#             raise HTTPException(status_code=400, detail="Không thể cập nhật trạng thái")

#         # Invalidate cache Spark
#         refresh_cache("dat_ve")

#         print(f"🚫 Đã cập nhật trạng thái hủy vé cho mã {ma_dat_ve}")
#         return JSONResponse(content={"message": f"Đã hủy vé {ma_dat_ve} thành công"})

#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         print("❌ Lỗi khi cập nhật trạng thái hủy vé:", e)
#         raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
