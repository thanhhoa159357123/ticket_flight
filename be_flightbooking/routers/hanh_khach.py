from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from models.hanh_khach import HanhKhach
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
from uuid import uuid4
from datetime import datetime, date

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
hanh_khach_collection = db["hanhkhach"]

# ✅ Request model cho /get-multiple
class MaHanhKhachRequest(BaseModel):
    ma_hanh_khach_list: List[str]


@router.post("", tags=["hanh_khach"])
def add_or_get_hanh_khach(hanh_khach: HanhKhach):
    try:
        print("🚀 Nhận dữ liệu hành khách:", hanh_khach.dict())

        # Convert ngày sinh về datetime nếu là date
        if isinstance(hanh_khach.ngay_sinh, date):
            ngay_sinh = datetime.combine(hanh_khach.ngay_sinh, datetime.min.time())
        else:
            ngay_sinh = hanh_khach.ngay_sinh

        # 🔍 Tìm hành khách đã tồn tại
        existing = hanh_khach_collection.find_one({
            "ho_hanh_khach": hanh_khach.ho_hanh_khach,
            "ten_hanh_khach": hanh_khach.ten_hanh_khach,
            "ngay_sinh": ngay_sinh,
            "quoc_tich": hanh_khach.quoc_tich,
        })

        if existing:
            existing["_id"] = str(existing["_id"])
            return JSONResponse(
                content={
                    "message": "Hành khách đã tồn tại",
                    "hanh_khach": jsonable_encoder(existing)
                }
            )

        # Tạo mã mới nếu chưa tồn tại
        while True:
            ma_hanh_khach = f"HK{uuid4().hex[:8].upper()}"
            if hanh_khach_collection.count_documents({"ma_hanh_khach": ma_hanh_khach}) == 0:
                break

        hanh_khach_data = hanh_khach.dict()
        hanh_khach_data["ma_hanh_khach"] = ma_hanh_khach
        hanh_khach_data["ngay_sinh"] = ngay_sinh

        insert_result = hanh_khach_collection.insert_one(hanh_khach_data)
        hanh_khach_data["_id"] = str(insert_result.inserted_id)

        return JSONResponse(
            content={"message": "Tạo hành khách thành công", "hanh_khach": jsonable_encoder(hanh_khach_data)}
        )

    except Exception as e:
        print("❌ Lỗi:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.post("/get-multiple", tags=["hanh_khach"])
def get_multiple_hanh_khach(body: MaHanhKhachRequest):
    """Lấy thông tin nhiều hành khách từ array mã hành khách"""
    try:
        ma_hanh_khach_list = body.ma_hanh_khach_list
        print(f"🔍 Nhận {len(ma_hanh_khach_list)} mã hành khách:", ma_hanh_khach_list)

        hanh_khach_list = list(hanh_khach_collection.find({
            "ma_hanh_khach": {"$in": ma_hanh_khach_list}
        }))

        for hanh_khach in hanh_khach_list:
            hanh_khach["_id"] = str(hanh_khach["_id"])
            if "ngay_sinh" in hanh_khach and isinstance(hanh_khach["ngay_sinh"], datetime):
                hanh_khach["ngay_sinh"] = hanh_khach["ngay_sinh"].strftime("%d/%m/%Y")

        found_ma = [hk["ma_hanh_khach"] for hk in hanh_khach_list]
        missing = [ma for ma in ma_hanh_khach_list if ma not in found_ma]

        return JSONResponse(content={
            "total_requested": len(ma_hanh_khach_list),
            "total_found": len(hanh_khach_list),
            "missing_count": len(missing),
            "missing_hanh_khach": missing,
            "hanh_khach_list": jsonable_encoder(hanh_khach_list)
        })

    except Exception as e:
        print("❌ Lỗi khi lấy nhiều hành khách:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("/{ma_hanh_khach}", tags=["hanh_khach"])
def get_hanh_khach(ma_hanh_khach: str):
    try:
        hanh_khach = hanh_khach_collection.find_one({"ma_hanh_khach": ma_hanh_khach})
        if not hanh_khach:
            raise HTTPException(status_code=404, detail="Không tìm thấy hành khách")

        hanh_khach["_id"] = str(hanh_khach["_id"])
        if "ngay_sinh" in hanh_khach and isinstance(hanh_khach["ngay_sinh"], datetime):
            hanh_khach["ngay_sinh"] = hanh_khach["ngay_sinh"].strftime("%d/%m/%Y")

        return JSONResponse(content=jsonable_encoder(hanh_khach))

    except HTTPException as he:
        raise he
    except Exception as e:
        print("❌ Lỗi khi lấy hành khách:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.delete("/delete-all", tags=["hanh_khach"])
def delete_all_hanh_khach():
    """Xóa tất cả dữ liệu hành khách - CHỈ DÙNG ĐỂ TEST"""
    try:
        result = hanh_khach_collection.delete_many({})
        print(f"🗑️ Đã xóa {result.deleted_count} records hành khách")
        return JSONResponse(content={
            "message": "Đã xóa tất cả dữ liệu hành khách thành công",
            "deleted_count": result.deleted_count
        })

    except Exception as e:
        print("❌ Lỗi khi xóa tất cả hành khách:", e)
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
