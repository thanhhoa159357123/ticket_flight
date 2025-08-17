from fastapi import APIRouter, HTTPException, Body, Path
from fastapi.responses import JSONResponse
from utils.spark import load_df, refresh_cache
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from utils.logger import logger
from datetime import datetime, timezone

router = APIRouter()
client = MongoClient(MONGO_URI)
khach_hang_collection = client[MONGO_DB]["khach_hang"]

@router.get("", tags=["khach_hang"])
def get_all_khach_hang():
    try:
        df = load_df("khach_hang")
        filtered_df = df.filter((df["deleted_at"] == "") & (df["is_active"] == True))

        selected_df = filtered_df.select(
            "ma_khach_hang", "ten_khach_hang", "so_dien_thoai", "email", "is_active", "da_dat_ve"
        )

        result = selected_df.toPandas().to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_all_khach_hang:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.get("/{ma_khach_hang}", tags=["khach_hang"])
def get_khach_hang(ma_khach_hang: str):
    try:
        df = load_df("khach_hang")
        result_df = df.filter((df["ma_khach_hang"] == ma_khach_hang) & (df["deleted_at"] == ""))

        if result_df.count() == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")

        row = result_df.first()
        result = {
            "ma_khach_hang": row["ma_khach_hang"],
            "ten_khach_hang": row["ten_khach_hang"],
            "so_dien_thoai": row["so_dien_thoai"],
            "email": row["email"],
            "is_active": row["is_active"],
            "da_dat_ve": row["da_dat_ve"],
            "last_active_at": row["last_active_at"]
        }

        return JSONResponse(content=result)

    except Exception as e:
        print("❌ Lỗi trong get_khach_hang:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")

@router.patch("/{ma_khach_hang}", tags=["khach_hang"])
def update_khach_hang_admin(
    ma_khach_hang: str = Path(...),
    ten_khach_hang: str = Body(None),
    so_dien_thoai: str = Body(None),
    email: str = Body(None),
    matkhau: str = Body(None),
    is_active: bool = Body(None)
):
    try:
        update_fields = {
            key: value for key, value in {
                "ten_khach_hang": ten_khach_hang,
                "so_dien_thoai": so_dien_thoai,
                "email": email,
                "matkhau": matkhau,
                "is_active": is_active
            }.items() if value is not None
        }

        if not update_fields:
            raise HTTPException(status_code=400, detail="Không có trường nào hợp lệ để cập nhật")

        update_fields["last_active_at"] = datetime.now(timezone.utc).isoformat()

        result = khach_hang_collection.update_one(
            {"ma_khach_hang": ma_khach_hang, "deleted_at": ""},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")

        logger.info(f"[ADMIN UPDATE] Mã KH: {ma_khach_hang} | Thay đổi: {update_fields}")
        refresh_cache("khach_hang")

        updated_doc = khach_hang_collection.find_one({"ma_khach_hang": ma_khach_hang})
        updated_doc.pop("_id", None)

        return JSONResponse(content={
            "message": "Cập nhật thành công",
            "khach_hang": updated_doc
        })

    except Exception as e:
        print("❌ Lỗi:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
