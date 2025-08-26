from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from datetime import datetime
from utils.spark import load_df, invalidate_cache
from utils.env_loader import DATA_MONGO_URI, DATA_MONGO_DB
from pyspark.sql.functions import col, count
from app.models.dat_ve import DatVe
from typing import List
import traceback

router = APIRouter()
client = MongoClient(DATA_MONGO_URI)
dat_ve_collection = client[DATA_MONGO_DB]["datve"]


# ===========================
# 📌 Lấy tất cả vé (filter theo mã khách hàng nếu có)
# ===========================
@router.get("", response_model=List[DatVe], tags=["datve"])
def get_all_ve(ma_khach_hang: str = Query(None)):
    try:
        df = load_df("datve")

        if ma_khach_hang:  # lọc theo mã khách hàng
            df = df.filter(df["ma_khach_hang"] == ma_khach_hang)

        # 🔹 Ép kiểu datetime về string trước khi convert
        for field in [
            "ngay_dat",
            "ngay_yeu_cau_hoan",
            "ngay_duyet_hoan",
            "ngay_hoan_ve",
        ]:
            if field in df.columns:
                df = df.withColumn(field, col(field).cast("string"))

        result = df.toPandas().fillna("").to_dict(orient="records")
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi server: {e}")


# ===========================
# 📌 Tìm kiếm vé theo mã đặt vé hoặc mã khách hàng
# ===========================
@router.get("/search", tags=["datve"])
def search_dat_ve(q: str = Query(...)):
    try:
        df = load_df("datve")
        df_filtered = df.filter(
            (col("ma_dat_ve").contains(q)) | (col("ma_khach_hang").contains(q))
        )

        # Ép datetime -> string
        for field in df_filtered.schema.fields:
            if str(field.dataType) in ["DateType", "TimestampType"]:
                df_filtered = df_filtered.withColumn(
                    field.name, col(field.name).cast("string")
                )

        data = df_filtered.toPandas().fillna("").to_dict(orient="records")
        return {"data": data, "message": f"Tìm thấy {len(data)} kết quả"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tìm kiếm: {e}")


# ===========================
# 📌 Thống kê số lượng vé (theo khách hàng hoặc toàn bộ)
# ===========================
@router.get("/thong_ke", tags=["datve"])
def thong_ke_ve(ma_khach_hang: str = None):
    try:
        df = load_df("datve")

        if ma_khach_hang:
            total = df.filter(col("ma_khach_hang") == ma_khach_hang).count()
            return {"ma_khach_hang": ma_khach_hang, "so_luong_ve": total}

        total_all = df.count()  # 👈 thêm tổng tất cả
        df_grouped = df.groupBy("ma_khach_hang").agg(count("*").alias("so_luong_ve"))

        result = df_grouped.toPandas().to_dict(orient="records")
        return {
            "total_bookings": total_all,  # 👈 thêm trường này
            "data": result,
            "message": "Thống kê theo từng khách hàng",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi thống kê: {e}")


# ===========================
# 📌 API dành cho admin - lấy tất cả vé từ MongoDB
# ===========================
@router.get("/admin/all", tags=["datve", "admin"])
def get_all_dat_ve_admin():
    try:
        mongo_results = list(dat_ve_collection.find({}).sort("ngay_dat", -1))

        formatted_results = []
        for record in mongo_results:
            record["_id"] = str(record["_id"])

            # Convert datetime -> string
            for field in [
                "ngay_dat",
                "ngay_yeu_cau_hoan",
                "ngay_duyet_hoan",
                "ngay_hoan_ve",
            ]:
                if field in record and isinstance(record[field], datetime):
                    record[field] = record[field].strftime("%Y-%m-%d %H:%M:%S")

            record.setdefault("trang_thai", "Đang xử lý")
            record.setdefault("loai_chuyen_di", "Một chiều")
            record.setdefault("ma_hang_ve", "N/A")
            record.setdefault("ma_chuyen_bay", "N/A")

            formatted_results.append(record)

        return formatted_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {e}")


# ===========================
# 📌 Tổng số vé đã đặt
# ===========================


@router.get("/total")
def get_total_datve():
    try:
        df = load_df("datve")
        total = df.count()
        return {"total": total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===========================
# 📌 API dành cho admin - Xử lý hoàn vé
# ===========================


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
        dat_ve_collection.update_one({"ma_dat_ve": ma_dat_ve}, {"$set": update_data})

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
                },
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
