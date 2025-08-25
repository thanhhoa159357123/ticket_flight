from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.tuyen_bay import TuyenBay
from utils.spark import load_df, invalidate_cache, get_spark
from utils.env_loader import DATA_MONGO_DB, DATA_MONGO_URI
from pymongo import MongoClient
import traceback

router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
tuyen_bay_collection = client[DATA_MONGO_DB]["tuyen_bay"]

@router.post("", tags=["tuyen_bay"])
def add_tuyen_bay(tuyen_bay: TuyenBay):
    try:
        print("📥 Dữ liệu nhận từ client:", tuyen_bay.dict())

        df = load_df("tuyen_bay")

        if (
            "ma_tuyen_bay" in df.columns
            and df.filter(df["ma_tuyen_bay"] == tuyen_bay.ma_tuyen_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Hãng bay đã tồn tại")

        data_to_insert = tuyen_bay.dict()
        inserted = tuyen_bay_collection.insert_one(data_to_insert)

        invalidate_cache("tuyen_bay")
        print("🎉 Thêm hãng bay thành công:", tuyen_bay.ma_tuyen_bay)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm tuyến bay thành công", "tuyen_bay": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["tuyen_bay"])
def get_all_tuyen_bay():
    try:
        df = load_df("tuyen_bay")

        # Các cột mong muốn
        df = df.select("ma_tuyen_bay", "ma_san_bay_di","ma_san_bay_den")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)
        
        # Nếu không có dữ liệu, trả về thông báo
        if not result:
            return JSONResponse(content={"message": "Không có tuyến bay nào"}) 
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong get_all_tuyen_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



# xử lý phần sửa hãng bay
@router.put("/{ma_tuyen_bay}", tags=["tuyen_bay"])
def update_tuyen_bay(ma_tuyen_bay: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Nhận yêu cầu cập nhật tuyến bay: {ma_tuyen_bay}, dữ liệu: {updated_data}")

        # Kiểm tra hãng bay có tồn tại không
        existing_tuyen_bay = tuyen_bay_collection.find_one({"ma_tuyen_bay": ma_tuyen_bay})
        if not existing_tuyen_bay:
            raise HTTPException(status_code=404, detail="Tuyến bay không tồn tại")

        if "ma_tuyen_bay" in updated_data:
            updated_data.pop("ma_tuyen_bay")  # Không cho phép cập nhật mã hãng bay
            updated_data["ma_san_bay_di"] = updated_data.get("ma_san_bay_di", existing_tuyen_bay["ma_san_bay_di"])
            updated_data["ma_san_bay_den"] = updated_data.get("ma_san_bay_den", existing_tuyen_bay["ma_san_bay_den"])

        result = tuyen_bay_collection.update_one(
            {"ma_tuyen_bay": ma_tuyen_bay},
            {"$set": updated_data}
        )
        invalidate_cache("tuyen_bay")

        if result.modified_count == 0:
            return JSONResponse(
                content={"message": "Không có thay đổi nào được thực hiện"},
                status_code=200
            )
        
        return JSONResponse(
            content={"message": f"Cập nhật tuyến bay {ma_tuyen_bay} thành công"}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /update:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



@router.delete("/{ma_tuyen_bay}", tags=["tuyen_bay"])
def delete_tuyen_bay(ma_tuyen_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_tuyen_bay}")

        result = tuyen_bay_collection.delete_one({"ma_tuyen_bay": ma_tuyen_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy tuyến bay cần xoá")

        return JSONResponse(content={"message": f"Đã xoá tuyến bay {ma_tuyen_bay} thành công"})

    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    



if __name__ == "__main__":
    print("✅ Router TuyenBay đã sẵn sàng")
