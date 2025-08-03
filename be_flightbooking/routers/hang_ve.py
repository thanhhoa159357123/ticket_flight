from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.hang_ve import HangVe
from pymongo import MongoClient
from utils.spark import load_df, invalidate_cache
from utils.env_loader import MONGO_URI, MONGO_DB

router = APIRouter()
client = MongoClient(MONGO_URI)
hang_ve_collection = client[MONGO_DB]["hang_ve"]


@router.get("", tags=["hang_ve"])
def get_all_hang_ve():
    try:
        df = load_df("hang_ve")
        df = df.select(
            "ma_hang_ve",
            "vi_tri_ngoi",
            "so_kg_hanh_ly_ky_gui",
            "so_kg_hanh_ly_xach_tay",
            "so_do_ghe",
            "khoang_cach_ghe",
            "refundable",
            "changeable",
        )
        result = df.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong /get:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("", tags=["hang_ve"])
def add_hang_ve(hang_ve: HangVe):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_ve.dict())
        df = load_df("hang_ve")

        if (
            "ma_hang_ve" in df.columns
            and df.where(df["ma_hang_ve"] == hang_ve.ma_hang_ve).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Mã hạng vé đã tồn tại")

        inserted = hang_ve_collection.insert_one(hang_ve.dict())
        invalidate_cache("hang_ve")

        return JSONResponse(
            content={"message": "Thêm thành công", "_id": str(inserted.inserted_id)},
            status_code=201,
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
