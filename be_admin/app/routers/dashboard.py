from fastapi import APIRouter, HTTPException
from utils.spark import load_df
from app.models.hoa_don import HoaDonBase
from pyspark.sql.functions import col




router = APIRouter()

@router.get("/dat_ve/total")
def get_total_bookings():
    try:
        df = load_df("dat_ve")

        # Loại bỏ vé bị hủy
        df = df.filter((df["trang_thai"].isNull()) | (df["trang_thai"] != "Đã hủy"))

        total = df.count()
        return {"total_bookings": total}
    except Exception as e:
        print("Lỗi khi đếm số lượng vé đã đặt:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

   

@router.get("/total_revenue")
def get_total_revenue():
    try:
        df = load_df("hoa_don")
        total = df.selectExpr("sum(tong_tien) as total").collect()[0]["total"]
        return {"total_revenue": total or 0}
    except Exception as e:
        print("Lỗi khi tính tổng doanh thu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")