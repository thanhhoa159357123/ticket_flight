from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.hang_ban_ve import HangBanVe
from utils.spark import load_df, invalidate_cache, get_spark
from utils.env_loader import DATA_MONGO_DB, DATA_MONGO_URI
from pymongo import MongoClient
import traceback

router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
hang_ban_ve_collection = client[DATA_MONGO_DB]["hang_ban_ve"]

@router.post("", tags=["hang_ban_ve"])
def add_hang_ban_ve(hang_ban_ve: HangBanVe):
    try:
        print("📥 Dữ liệu nhận từ client:", hang_ban_ve.dict())

        df = load_df("hang_ban_ve")

        if (
            "ma_hang_ban_ve" in df.columns
            and df.filter(df["ma_hang_ban_ve"] == hang_ban_ve.ma_hang_ban_ve).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bán vé đã tồn tại")

        data_to_insert = hang_ban_ve.dict()
        inserted = hang_ban_ve_collection.insert_one(data_to_insert)

        invalidate_cache("hang_ban_ve")
        print("🎉 Thêm hãng bán vé thành công:", hang_ban_ve.ma_hang_ban_ve)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm hãng bán vé thành công", "hang_ban_ve": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["hang_ban_ve"])
def get_all_hang_ban_ve():
    try:
        df = load_df("hang_ban_ve")

        # Các cột mong muốn
        df = df.select("ma_hang_ban_ve", "ten_hang_ban_ve", "vai_tro")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)
        
        # Nếu không có dữ liệu, trả về thông báo
        if not result:
            return JSONResponse(content={"message": "Không có hãng ban ve nào"}) 
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong get_all_hang_ban_ve:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



# xử lý phần sửa hãng bay
@router.put("/{ma_hang_ban_ve}", tags=["hang_ban_ve"])
def update_hang_ban_ve(ma_hang_ban_ve: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Nhận yêu cầu cập nhật hãng bay: {ma_hang_ban_ve}, dữ liệu: {updated_data}")

        # Kiểm tra hãng bay có tồn tại không
        existing_hang_ban_ve = hang_ban_ve_collection.find_one({"ma_hang_ban_ve": ma_hang_ban_ve})
        if not existing_hang_ban_ve:
            raise HTTPException(status_code=404, detail="Hãng bán vé không tồn tại")

        if "hang_ban_ve" in updated_data:
            updated_data.pop("ma_hang_ban_ve")  # Không cho phép cập nhật mã hãng bán vé
            updated_data["ten_hang_ban_ve"] = updated_data.get("ten_hang_ban_ve", existing_hang_ban_ve["ten_hang_ban_ve"])
            updated_data["vai_tro"] = updated_data.get("vai_tro", existing_hang_ban_ve["vai_tro"])

        result = hang_ban_ve_collection.update_one(
            {"ma_hang_ban_ve": ma_hang_ban_ve},
            {"$set": updated_data}
        )
        invalidate_cache("hang_ban_ve")

        if result.modified_count == 0:
            return JSONResponse(
                content={"message": "Không có thay đổi nào được thực hiện"},
                status_code=200
            )
        
        return JSONResponse(
            content={"message": f"Cập nhật hãng bay {ma_hang_ban_ve} thành công"}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /update:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



@router.delete("/{ma_hang_ban_ve}", tags=["hang_ban_ve"])
def delete_hang_ban_ve(ma_hang_ban_ve: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_hang_ban_ve}")

        result = hang_ban_ve_collection.delete_one({"ma_hang_ban_ve": ma_hang_ban_ve})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy hãng bán vé cần xoá")

        return JSONResponse(content={"message": f"Đã xoá hãng bay {ma_hang_ban_ve} thành công"})

    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    



if __name__ == "__main__":
    print("✅ Router hangBanVe đã sẵn sàng")
