from fastapi import APIRouter, HTTPException
from utils.spark import load_df
from pyspark.sql import functions as F

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ====== ĐẶT VÉ ======
@router.get("/datve/total")
def get_total_bookings():
    """Tổng số vé đã đặt (bỏ qua vé hủy)"""
    try:
        df = load_df("datve")
        df = df.filter((df["trang_thai"].isNull()) | (df["trang_thai"] != "Đã hủy"))
        total = df.count()
        return {"total_bookings": total}
    except Exception as e:
        print("❌ Lỗi khi đếm số lượng vé:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/datve/by-status")
def bookings_by_status():
    """Thống kê số lượng vé theo trạng thái"""
    try:
        df = load_df("datve")
        df_grouped = df.groupBy("trang_thai").agg(F.count("*").alias("so_luong"))
        data = [row.asDict() for row in df_grouped.collect()]
        return {"bookings_by_status": data}
    except Exception as e:
        print("❌ Lỗi khi thống kê vé:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


# ====== HÓA ĐƠN ======
@router.get("/hoadon/total")
def get_total_hoa_don():
    """Tổng số hóa đơn"""
    try:
        df = load_df("hoadon")
        return {"total_hoa_don": df.count()}
    except Exception as e:
        print("❌ Lỗi khi đếm hóa đơn:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/hoadon/revenue")
def get_total_revenue():
    """Tổng doanh thu"""
    try:
        df = load_df("hoadon")
        total = df.select(F.sum("tong_tien").alias("total")).collect()[0]["total"]
        return {"total_revenue": total or 0}
    except Exception as e:
        print("❌ Lỗi khi tính doanh thu:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/hoadon/revenue/by-month")
def revenue_by_month():
    """Doanh thu theo tháng"""
    try:
        df = load_df("hoadon")
        df_grouped = (
            df.groupBy(F.substring("ngay_thanh_toan", 1, 7).alias("month"))
            .agg(F.sum("tong_tien").alias("doanh_thu"))
            .orderBy("month")
        )
        data = [row.asDict() for row in df_grouped.collect()]
        return {"revenue_by_month": data}
    except Exception as e:
        print("❌ Lỗi khi thống kê doanh thu theo tháng:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
