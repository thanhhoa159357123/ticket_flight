from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_bay import HangBay
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
import json

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_bay_collection = client[MONGO_DB]["hang_bay"]

@router.post("", tags=["hang_bay"])
def add_hang_bay(hang_bay: HangBay):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_bay.dict())

        df = load_df("hang_bay")

        if (
            "ma_hang_bay" in df.columns
            and df.filter(df["ma_hang_bay"] == hang_bay.ma_hang_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bay đã tồn tại")

        data_to_insert = hang_bay.dict()
        inserted = hang_bay_collection.insert_one(data_to_insert)

        invalidate_cache("hang_bay")
        print("🎉 Thêm hãng bay thành công:", hang_bay.ma_hang_bay)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm hãng bay thành công", "hang_bay": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["hang_bay"])
def get_all_hang_bay():
    try:
        df = load_df("hang_bay")

        # Các cột mong muốn
        df = df.select("ma_hang_bay", "ten_hang_bay", "iata_code", "quoc_gia")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_hang_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.delete("/{ma_hang_bay}", tags=["hang_bay"])
def delete_hang_bay(ma_hang_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_hang_bay}")

        result = hang_bay_collection.delete_one({"ma_hang_bay": ma_hang_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay cần xoá")

        return JSONResponse(content={"message": f"Đã xoá hãng bay {ma_hang_bay} thành công"})

    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
