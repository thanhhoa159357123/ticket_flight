from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi import Query
from models.dat_ve import DatVe
from utils.spark import load_df, invalidate_cache
from utils.spark_views import cached_views
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from datetime import datetime, date
import pandas as pd
import uuid

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
dat_ve_collection = db["dat_ve"]


@router.post("", tags=["dat_ve"])
def add_dat_ve(dat_ve: DatVe):
    try:
        print("🚀 Dữ liệu nhận được từ client:", dat_ve.dict())

        df_dat_ve = cached_views["dat_ve"]
        df_khach_hang = cached_views["khach_hang"]
        df_hang_ve = cached_views["hang_ve"]
        df_tuyen_bay = cached_views["tuyen_bay"]

        # ✅ Kiểm tra mã khách hàng
        if df_khach_hang.filter(df_khach_hang.ma_khach_hang == dat_ve.ma_khach_hang).count() == 0:
            raise HTTPException(status_code=400, detail="Mã khách hàng không tồn tại")

        # ✅ Validation chiều đi (bắt buộc) - SỬA LẠI
        if dat_ve.ma_hang_ve_di:
            if df_hang_ve.filter(df_hang_ve.ma_hang_ve == dat_ve.ma_hang_ve_di).count() == 0:
                raise HTTPException(status_code=400, detail="Mã hạng vé chiều đi không tồn tại")
        
        if dat_ve.ma_tuyen_bay_di:
            if df_tuyen_bay.filter(df_tuyen_bay.ma_tuyen_bay == dat_ve.ma_tuyen_bay_di).count() == 0:
                raise HTTPException(status_code=400, detail="Mã tuyến bay chiều đi không tồn tại")

        # ✅ Validation chiều về (nếu khứ hồi)
        if dat_ve.loai_chuyen_di == "Khứ hồi":
            if not dat_ve.ma_hang_ve_ve:
                raise HTTPException(status_code=400, detail="Vé khứ hồi cần mã hạng vé chiều về")
            if not dat_ve.ma_tuyen_bay_ve:
                raise HTTPException(status_code=400, detail="Vé khứ hồi cần mã tuyến bay chiều về")
                
            if df_hang_ve.filter(df_hang_ve.ma_hang_ve == dat_ve.ma_hang_ve_ve).count() == 0:
                raise HTTPException(status_code=400, detail="Mã hạng vé chiều về không tồn tại")
            
            if df_tuyen_bay.filter(df_tuyen_bay.ma_tuyen_bay == dat_ve.ma_tuyen_bay_ve).count() == 0:
                raise HTTPException(status_code=400, detail="Mã tuyến bay chiều về không tồn tại")

        # 🆕 Sinh mã đặt vé nếu chưa có
        ma_dat_ve = dat_ve.ma_dat_ve or f"DV{uuid.uuid4().hex[:8].upper()}"

        # 💡 Kiểm tra trùng mã
        if "ma_dat_ve" in df_dat_ve.columns:
            if df_dat_ve.filter(df_dat_ve["ma_dat_ve"] == ma_dat_ve).count() > 0:
                raise HTTPException(status_code=400, detail="Mã đặt vé đã tồn tại")

        # 🔄 Chuẩn bị dữ liệu để insert
        data_to_insert = dat_ve.dict()
        data_to_insert["ma_dat_ve"] = ma_dat_ve

        if isinstance(data_to_insert["ngay_dat"], date):
            data_to_insert["ngay_dat"] = datetime.combine(
                data_to_insert["ngay_dat"], datetime.min.time()
            )

        # 📥 Ghi vào MongoDB
        insert_result = dat_ve_collection.insert_one(data_to_insert)
        invalidate_cache("dat_ve")

        # ✅ Chuẩn bị dữ liệu để trả về (convert datetime -> string)
        data_to_insert["_id"] = str(insert_result.inserted_id)
        data_to_insert["ngay_dat"] = data_to_insert["ngay_dat"].isoformat()

        print("✅ Đặt vé thành công:", ma_dat_ve)
        return JSONResponse(
            content={"message": "Thêm đặt vé thành công", "dat_ve": data_to_insert}
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["dat_ve"])
def get_existing_dat_ve(
    ma_khach_hang: str = Query(...), 
    loai_chuyen_di: str = Query(None)  # Optional cho new format
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
                "ma_tuyen_bay_di": result.get("ma_tuyen_bay_di"),
                "ma_hang_ve_ve": result.get("ma_hang_ve_ve"),
                "ma_tuyen_bay_ve": result.get("ma_tuyen_bay_ve"),
                "trang_thai": result.get("trang_thai", "Đang xử lý"),
            },
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi get_existing_dat_ve:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.delete("/{ma_dat_ve}", tags=["dat_ve"])
def cancel_dat_ve(ma_dat_ve: str):
    try:
        # Tìm bản ghi đặt vé
        result = dat_ve_collection.find_one({"ma_dat_ve": ma_dat_ve})
        if not result:
            raise HTTPException(status_code=404, detail="Không tìm thấy mã đặt vé")

        # Cập nhật trạng thái sang "Đã hủy"
        update_result = dat_ve_collection.update_one(
            {"ma_dat_ve": ma_dat_ve}, {"$set": {"trang_thai": "Đã hủy"}}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Không thể cập nhật trạng thái")

        # Invalidate cache Spark
        invalidate_cache("dat_ve")

        print(f"🚫 Đã cập nhật trạng thái hủy vé cho mã {ma_dat_ve}")
        return JSONResponse(content={"message": f"Đã hủy vé {ma_dat_ve} thành công"})

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi khi cập nhật trạng thái hủy vé:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/all", tags=["dat_ve"])
def get_all_dat_ve_by_user(ma_khach_hang: str = Query(...)):
    try:
        # ✅ Thử truy vấn trực tiếp từ MongoDB trước
        mongo_results = list(dat_ve_collection.find({"ma_khach_hang": ma_khach_hang}).sort("ngay_dat", -1))
        
        if not mongo_results:
            print(f"❌ Không có data trong MongoDB cho khách hàng: {ma_khach_hang}")
            return JSONResponse(content=[])
        
        print(f"✅ Tìm thấy {len(mongo_results)} records trong MongoDB")
        print("🔍 Sample record:", mongo_results[0])
        
        # ✅ Force reload Spark cache
        invalidate_cache("dat_ve")
        df_dat_ve = load_df("dat_ve")
        
        print(f"🔍 Spark DataFrame count: {df_dat_ve.count()}")
        if df_dat_ve.count() == 0:
            print("❌ Spark DataFrame empty, return MongoDB data directly")
            # Convert MongoDB data và return trực tiếp
            for record in mongo_results:
                record["_id"] = str(record["_id"])
                if isinstance(record.get("ngay_dat"), datetime):
                    record["ngay_dat"] = record["ngay_dat"].strftime('%Y-%m-%d %H:%M:%S')
            return JSONResponse(content=mongo_results)
        
        print("🔍 Spark columns:", df_dat_ve.columns)
        
        # ✅ Kiểm tra columns mới có tồn tại không
        required_new_cols = ["ma_hang_ve_di", "ma_tuyen_bay_di", "loai_chuyen_di"]
        missing_cols = [col for col in required_new_cols if col not in df_dat_ve.columns]
        
        if missing_cols:
            print(f"❌ Missing columns: {missing_cols}, fallback to MongoDB")
            # Fallback to MongoDB data
            for record in mongo_results:
                record["_id"] = str(record["_id"])
                if isinstance(record.get("ngay_dat"), datetime):
                    record["ngay_dat"] = record["ngay_dat"].strftime('%Y-%m-%d %H:%M:%S')
            return JSONResponse(content=mongo_results)

        # ✅ Nếu có đủ columns, chạy Spark query
        spark = df_dat_ve.sparkSession

        # Register views
        for name in ["dat_ve", "hang_ve", "tuyen_bay", "khach_hang", "san_bay"]:
            cached_views[name].unpersist()
            cached_views[name].createOrReplaceTempView(name)

        query = f"""
        SELECT
            dv.ma_dat_ve,
            date_format(dv.ngay_dat, 'yyyy-MM-dd HH:mm:ss') as ngay_dat,
            dv.trang_thai,
            dv.ma_khach_hang,
            dv.loai_chuyen_di,
            
            -- Fields mới
            dv.ma_hang_ve_di,
            dv.ma_tuyen_bay_di,
            COALESCE(hv_di.vi_tri_ngoi, 'N/A') AS vi_tri_ngoi_di,
            COALESCE(tb_di.ma_san_bay_di, 'N/A') AS ma_san_bay_di,
            COALESCE(tb_di.ma_san_bay_den, 'N/A') AS ma_san_bay_den_di,
            COALESCE(sb_di_start.ten_san_bay, 'N/A') AS ten_san_bay_di,
            COALESCE(sb_di_end.ten_san_bay, 'N/A') AS ten_san_bay_den_di,
            
            -- Fields chiều về
            dv.ma_hang_ve_ve,
            dv.ma_tuyen_bay_ve,
            COALESCE(hv_ve.vi_tri_ngoi, NULL) AS vi_tri_ngoi_ve,
            COALESCE(tb_ve.ma_san_bay_di, NULL) AS ma_san_bay_di_ve,
            COALESCE(tb_ve.ma_san_bay_den, NULL) AS ma_san_bay_den_ve,
            COALESCE(sb_ve_start.ten_san_bay, NULL) AS ten_san_bay_di_ve,
            COALESCE(sb_ve_end.ten_san_bay, NULL) AS ten_san_bay_den_ve
            
        FROM dat_ve dv
        LEFT JOIN hang_ve hv_di ON dv.ma_hang_ve_di = hv_di.ma_hang_ve
        LEFT JOIN tuyen_bay tb_di ON dv.ma_tuyen_bay_di = tb_di.ma_tuyen_bay
        LEFT JOIN san_bay sb_di_start ON tb_di.ma_san_bay_di = sb_di_start.ma_san_bay
        LEFT JOIN san_bay sb_di_end ON tb_di.ma_san_bay_den = sb_di_end.ma_san_bay
        
        LEFT JOIN hang_ve hv_ve ON dv.ma_hang_ve_ve = hv_ve.ma_hang_ve
        LEFT JOIN tuyen_bay tb_ve ON dv.ma_tuyen_bay_ve = tb_ve.ma_tuyen_bay
        LEFT JOIN san_bay sb_ve_start ON tb_ve.ma_san_bay_di = sb_ve_start.ma_san_bay
        LEFT JOIN san_bay sb_ve_end ON tb_ve.ma_san_bay_den = sb_ve_end.ma_san_bay
        
        WHERE dv.ma_khach_hang = '{ma_khach_hang}'
        ORDER BY dv.ngay_dat DESC
        """
        
        df = spark.sql(query)
        pdf = df.toPandas()
        
        print("✅ Spark query thành công, số records:", len(pdf))
        return JSONResponse(content=pdf.to_dict(orient="records"))

    except Exception as e:
        print("❌ Lỗi get_all_dat_ve_by_user:", e)
        # ✅ Fallback cuối cùng - return MongoDB data
        try:
            mongo_results = list(dat_ve_collection.find({"ma_khach_hang": ma_khach_hang}).sort("ngay_dat", -1))
            for record in mongo_results:
                record["_id"] = str(record["_id"])
                if isinstance(record.get("ngay_dat"), datetime):
                    record["ngay_dat"] = record["ngay_dat"].strftime('%Y-%m-%d %H:%M:%S')
            print(f"✅ Fallback success: {len(mongo_results)} records")
            return JSONResponse(content=mongo_results)
        except Exception as fallback_error:
            print("❌ Fallback failed:", fallback_error)
            raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    

@router.delete("/delete-all", tags=["dat_ve"])
def delete_all_dat_ve():
    """Xóa tất cả dữ liệu đặt vé - CHỈ DÙNG ĐỂ TEST"""
    try:
        # Xóa tất cả records trong collection dat_ve
        result = dat_ve_collection.delete_many({})
        
        # Invalidate cache
        invalidate_cache("dat_ve")
        
        print(f"🗑️ Đã xóa tất cả {result.deleted_count} records đặt vé")
        return JSONResponse(content={
            "message": f"Đã xóa tất cả dữ liệu đặt vé thành công",
            "deleted_count": result.deleted_count
        })
        
    except Exception as e:
        print("❌ Lỗi khi xóa tất cả đặt vé:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    
# ✅ Hybrid approach: Dùng Spark để validate + MongoDB để update
@router.patch("/{ma_dat_ve}/refund", tags=["dat_ve"])
def request_refund_ticket_hybrid(ma_dat_ve: str):
    try:
        # 🔍 BƯỚC 1: Dùng SPARK để VALIDATE (READ operations)
        spark = cached_views["dat_ve"].sparkSession
        
        # Register views cần thiết
        for view_name in ["dat_ve", "hang_ve"]:
            cached_views[view_name].createOrReplaceTempView(view_name)

        # Spark query để validation
        validation_query = f"""
        SELECT 
            dv.ma_dat_ve,
            dv.trang_thai,
            dv.ma_khach_hang,
            dv.ma_hang_ve_di,
            hv.refundable,
            hv.vi_tri_ngoi
        FROM dat_ve dv
        LEFT JOIN hang_ve hv ON dv.ma_hang_ve_di = hv.ma_hang_ve
        WHERE dv.ma_dat_ve = '{ma_dat_ve}'
        """
        
        df_result = spark.sql(validation_query)
        results = df_result.collect()
        
        if len(results) == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy mã đặt vé")
        
        ticket_info = results[0]
        
        # ✅ Kiểm tra trạng thái
        if ticket_info["trang_thai"] != "Đã thanh toán":
            raise HTTPException(
                status_code=400, 
                detail=f"Chỉ có thể hoàn vé đã thanh toán. Trạng thái hiện tại: {ticket_info['trang_thai']}"
            )

        # ✅ Kiểm tra điều kiện refundable từ Spark
        is_refundable = ticket_info["refundable"] if ticket_info["refundable"] is not None else True
        
        if not is_refundable:
            raise HTTPException(
                status_code=400, 
                detail=f"Loại vé {ticket_info['vi_tri_ngoi']} không thể hoàn. Vui lòng liên hệ hotline để được hỗ trợ."
            )

        print(f"✅ Spark validation passed - Khách hàng: {ticket_info['ma_khach_hang']}, Hạng vé: {ticket_info['vi_tri_ngoi']}")

        # 💾 BƯỚC 2: Chỉ cập nhật dat_ve collection
        update_result = dat_ve_collection.update_one(
            {"ma_dat_ve": ma_dat_ve}, 
            {
                "$set": {
                    "trang_thai": "Chờ duyệt hoàn vé",
                    "ngay_yeu_cau_hoan": datetime.now(),
                    "ly_do_hoan": "Khách hàng yêu cầu hoàn vé",
                    "nguoi_yeu_cau": ticket_info["ma_khach_hang"],
                    "trang_thai_duyet": "Chờ xử lý",
                    "gia_ve_hoan": 1500000,
                    "admin_xem": False  # 🆕 Đánh dấu admin chưa xem
                }
            }
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Không thể cập nhật trạng thái")

        # 🗑️ BỎ PHẦN TẠO NOTIFICATION

        # 🔄 SYNC dữ liệu
        invalidate_cache("dat_ve")

        return JSONResponse(content={
            "message": f"Yêu cầu hoàn vé {ma_dat_ve} đã được gửi thành công. Chúng tôi sẽ xử lý trong vòng 24-48h.",
            "ma_dat_ve": ma_dat_ve,
            "trang_thai_moi": "Chờ duyệt hoàn vé",
            "thoi_gian_xu_ly": "24-48 giờ",
            "hang_ve": ticket_info["vi_tri_ngoi"],
            "khach_hang": ticket_info["ma_khach_hang"]
        })

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi hybrid refund request:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.patch("/{ma_dat_ve}/approve-refund", tags=["admin"])
def approve_refund_hybrid(ma_dat_ve: str, approved: bool):
    try:
        # 🔍 Tìm thông tin vé từ MongoDB
        ticket_doc = dat_ve_collection.find_one({"ma_dat_ve": ma_dat_ve})
        
        if not ticket_doc:
            raise HTTPException(status_code=404, detail="Không tìm thấy mã đặt vé")
        
        if ticket_doc["trang_thai"] != "Chờ duyệt hoàn vé":
            raise HTTPException(
                status_code=400, 
                detail=f"Vé không ở trạng thái chờ duyệt. Trạng thái hiện tại: {ticket_doc['trang_thai']}"
            )

        # 💾 Update vé trong MongoDB
        if approved:
            # ✅ DUYỆT: Chuyển thành "Đã hoàn vé"
            new_status = "Đã hoàn vé"
            update_data = {
                "trang_thai": new_status,
                "ngay_duyet_hoan": datetime.now(),
                "trang_thai_duyet": "Đã duyệt",
                "admin_duyet": "SYSTEM",
                "ngay_hoan_ve": datetime.now(),
                "so_tien_hoan": ticket_doc.get("gia_ve_hoan", 1500000)
            }
        else:
            # ❌ TỪ CHỐI: Chuyển về lại "Đã thanh toán"
            new_status = "Đã thanh toán"
            update_data = {
                "trang_thai": new_status,
                "ngay_duyet_hoan": datetime.now(),
                "trang_thai_duyet": "Từ chối",
                "admin_duyet": "SYSTEM",
                "ly_do_tu_choi": "Admin từ chối yêu cầu hoàn vé"
            }

        # Update vé
        dat_ve_collection.update_one(
            {"ma_dat_ve": ma_dat_ve}, 
            {"$set": update_data}
        )

        # Nếu từ chối, xóa các field liên quan đến hoàn vé
        if not approved:
            dat_ve_collection.update_one(
                {"ma_dat_ve": ma_dat_ve}, 
                {"$unset": {
                    "ngay_yeu_cau_hoan": "",
                    "gia_ve_hoan": "",
                    "nguoi_yeu_cau": "",
                    "admin_xem": ""
                }}
            )

        # 🗑️ BỎ PHẦN TẠO NOTIFICATION

        # 🔄 SYNC dữ liệu
        invalidate_cache("dat_ve")

        action_text = "Đã duyệt" if approved else "Đã từ chối"
        print(f"✅ {action_text} hoàn vé {ma_dat_ve}")
        print(f"📝 Trạng thái mới: {new_status}")

        return JSONResponse(content={
            "message": f"{action_text} hoàn vé {ma_dat_ve}",
            "approved": approved,
            "new_status": new_status,
            "so_tien_hoan": ticket_doc.get("gia_ve_hoan", 1500000) if approved else 0,
            "note": "Vé được trả về trạng thái đã thanh toán" if not approved else "Vé đã được hoàn thành công"
        })

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ Lỗi hybrid approve refund: {e}")
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    
