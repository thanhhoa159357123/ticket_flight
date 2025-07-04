from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.san_bay import SanBay
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient

router = APIRouter()
client = MongoClient(MONGO_URI)
san_bay_collection = client[MONGO_DB]["san_bay"]

@router.post("", tags=["san_bay"])  # 👉 POST /api/san-bay
def add_san_bay(san_bay: SanBay):
    try:
        print("📥 Dữ liệu nhận từ client:", san_bay.dict())
        df = load_df("san_bay")

        if (
            "ma_san_bay" in df.columns
            and df.filter(df["ma_san_bay"] == san_bay.ma_san_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Sân bay đã tồn tại")

        data_to_insert = san_bay.dict()
        inserted = san_bay_collection.insert_one(data_to_insert)
        data_to_insert["_id"] = str(inserted.inserted_id)

        invalidate_cache("san_bay")

        return JSONResponse(
            content={"message": "Thêm sân bay thành công", "san_bay": data_to_insert}
        )
    except Exception as e:
        print("❌ Lỗi trong POST /san-bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("", tags=["san_bay"])  # 👉 GET /api/san-bay
def get_all_san_bay():
    try:
        df = load_df("san_bay")
        df = df.select("ma_san_bay", "ten_san_bay", "thanh_pho", "ma_quoc_gia", "iata_code")
        result = df.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)
    except Exception as e:
        print("❌ Lỗi trong GET /san-bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.delete("/{ma_san_bay}", tags=["san_bay"])  # 👉 DELETE /api/san-bay/{ma_san_bay}
def delete_san_bay(ma_san_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá sân bay: {ma_san_bay}")

        result = san_bay_collection.delete_one({"ma_san_bay": ma_san_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay cần xoá")

        invalidate_cache("san_bay")

        return JSONResponse(content={"message": f"Đã xoá sân bay {ma_san_bay} thành công"})
    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi trong DELETE /san-bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
