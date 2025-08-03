from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.tuyen_bay import TuyenBay
from utils.spark import invalidate_cache, load_df
from utils.spark_views import cached_views
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
tuyen_bay_collection = db["tuyen_bay"]

# Hàm kiểm tra sân bay có tồn tại
def check_san_bay_exists(ma_san_bay: str) -> bool:
    df_san_bay = cached_views.get("san_bay") or load_df("san_bay")
    return df_san_bay.filter(df_san_bay["ma_san_bay"] == ma_san_bay).count() > 0

@router.post("", tags=["tuyen_bay"])
def add_tuyen_bay(tuyen_bay: TuyenBay):
    print("🔥 Nhận yêu cầu POST /add")
    try:
        print("📥 Dữ liệu nhận từ client:", tuyen_bay.dict())

        if tuyen_bay.ma_san_bay_di == tuyen_bay.ma_san_bay_den:
            raise HTTPException(status_code=400, detail="Không được chọn cùng một sân bay")

        if not check_san_bay_exists(tuyen_bay.ma_san_bay_di):
            raise HTTPException(status_code=400, detail="Sân bay đi không tồn tại")

        if not check_san_bay_exists(tuyen_bay.ma_san_bay_den):
            raise HTTPException(status_code=400, detail="Sân bay đến không tồn tại")

        df_tuyen = cached_views.get("tuyen_bay") or load_df("tuyen_bay")
        if df_tuyen.filter(df_tuyen["ma_tuyen_bay"] == tuyen_bay.ma_tuyen_bay).count() > 0:
            raise HTTPException(status_code=400, detail="Mã tuyến bay đã tồn tại")

        inserted = tuyen_bay_collection.insert_one(tuyen_bay.dict())
        data = tuyen_bay.dict()
        data["_id"] = str(inserted.inserted_id)

        invalidate_cache("tuyen_bay")

        print("🎉 Thêm tuyến bay thành công:", tuyen_bay.ma_tuyen_bay)
        return JSONResponse(content={"message": "Thêm tuyến bay thành công", "tuyen_bay": data})

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["tuyen_bay"])
def get_all_tuyen_bay():
    try:
        spark = cached_views["tuyen_bay"].sparkSession

        # Đảm bảo views còn tồn tại
        cached_views["tuyen_bay"].createOrReplaceTempView("tuyen_bay")
        cached_views["san_bay"].createOrReplaceTempView("san_bay")

        query = """
        SELECT 
            tb.ma_tuyen_bay,
            tb.ma_san_bay_di,
            sbd.ten_san_bay AS ten_san_bay_di,
            sbd.thanh_pho AS thanh_pho_di,
            tb.ma_san_bay_den,
            sbd2.ten_san_bay AS ten_san_bay_den,
            sbd2.thanh_pho AS thanh_pho_den
        FROM tuyen_bay tb
        LEFT JOIN san_bay sbd ON tb.ma_san_bay_di = sbd.ma_san_bay
        LEFT JOIN san_bay sbd2 ON tb.ma_san_bay_den = sbd2.ma_san_bay
        """

        df_result = spark.sql(query)
        result = df_result.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_tuyen_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_tuyen_bay}", tags=["tuyen_bay"])
def delete_tuyen_bay(ma_tuyen_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_tuyen_bay}")
        result = tuyen_bay_collection.delete_one({"ma_tuyen_bay": ma_tuyen_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay cần xoá")

        invalidate_cache("tuyen_bay")

        return JSONResponse(content={"message": f"Đã xoá tuyến bay {ma_tuyen_bay} thành công"})

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
