from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from app.models.san_bay import SanBay
from utils.spark import load_df, invalidate_cache, get_spark
from utils.env_loader import DATA_MONGO_DB, DATA_MONGO_URI
from pymongo import MongoClient
import traceback

router = APIRouter()

# Kết nối MongoDB
client = MongoClient(DATA_MONGO_URI)
san_bay_collection = client[DATA_MONGO_DB]["sanbay"]

@router.post("", tags=["sanbay"])
def add_san_bay(san_bay: SanBay):
    try:
        print("📥 Dữ liệu nhận từ client:", san_bay.dict())

        df = load_df("sanbay")

        if (
            "ma_san_bay" in df.columns
            and df.filter(df["ma_san_bay"] == san_bay.ma_san_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Sân bay đã tồn tại")

        data_to_insert = san_bay.dict()
        inserted = san_bay_collection.insert_one(data_to_insert)

        invalidate_cache("sanbay")
        print("🎉 Thêm sân bay thành công:", san_bay.ma_san_bay)

        # Gắn lại _id vào dict theo dạng chuỗi nếu muốn trả về
        data_to_insert["_id"] = str(inserted.inserted_id)

        return JSONResponse(
            content={"message": "Thêm sân bay thành công", "san_bay": data_to_insert}
        )

    except Exception as e:
        print("❌ Lỗi trong /add:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")


@router.get("", tags=["sanbay"])
def get_all_san_bay():
    try:
        df = load_df("sanbay")

        # Các cột mong muốn
        df = df.select("ma_san_bay", "ten_san_bay", "thanh_pho","ma_quoc_gia","iata_code")
        result = df.toPandas().to_dict(orient="records")

        return JSONResponse(content=result)
        
        # Nếu không có dữ liệu, trả về thông báo
        if not result:
            return JSONResponse(content={"message": "Không có san bay nào"}) 
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong get_all_san_bay:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



# xử lý phần sửa sân bay
@router.put("/{ma_san_bay}", tags=["sanbay"])
def update_san_bay(ma_san_bay: str, updated_data: dict = Body(...)):
    try:
        print(f"✏️ Nhận yêu cầu cập nhật sân bay: {ma_san_bay}, dữ liệu: {updated_data}")

        # Kiểm tra hãng bay có tồn tại không
        existing_san_bay = san_bay_collection.find_one({"ma_san_bay": ma_san_bay})
        if not existing_san_bay:
            raise HTTPException(status_code=404, detail="Sân bay không tồn tại")

        if "ma_san_bay" in updated_data:
            updated_data.pop("ma_san_bay")  # Không cho phép cập nhật mã hãng bay
            updated_data["ten_san_bay"] = updated_data.get("ten_san_bay", existing_san_bay["ten_san_bay"])
            updated_data["thanh_pho"] = updated_data.get("thanh_pho",existing_san_bay["thanh_pho"])
            updated_data["ma_quoc_gia"] = updated_data.get("ma_quoc_gia", existing_san_bay["ma_quoc_gia"])
            updated_data["iata_code"] = updated_data.get("iata_code", existing_san_bay["iata_code"])

        result = san_bay_collection.update_one(
            {"ma_san_bay": ma_san_bay},
            {"$set": updated_data}
        )
        invalidate_cache("sanbay")

        if result.modified_count == 0:
            return JSONResponse(
                content={"message": "Không có thay đổi nào được thực hiện"},
                status_code=200
            )
        
        return JSONResponse(
            content={"message": f"Cập nhật sân bay {ma_san_bay} thành công"}
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        print("❌ Lỗi trong /update:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")



@router.delete("/{ma_san_bay}", tags=["sanbay"])
def delete_hang_bay(ma_san_bay: str):
    try:
        print(f"🗑 Nhận yêu cầu xoá tuyến bay: {ma_san_bay}")

        result = san_bay_collection.delete_one({"ma_san_bay": ma_san_bay})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy sân bay cần xoá")

        return JSONResponse(content={"message": f"Đã xoá hãng bay {ma_san_bay} thành công"})

    except HTTPException as he:
        raise he

    except Exception as e:
        print("❌ Lỗi trong /delete:", str(e))
        raise HTTPException(status_code=500, detail="Lỗi server nội bộ")
    



if __name__ == "__main__":
    print("✅ Router hangBay đã sẵn sàng")
