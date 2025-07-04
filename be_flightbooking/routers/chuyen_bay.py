from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.chuyen_bay import ChuyenBay
from utils.spark import get_spark
from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient
import pandas as pd
import pytz

router = APIRouter()
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
chuyen_bay_collection = db["chuyen_bay"]
tuyen_bay_collection = db["tuyen_bay"]
hang_bay_collection = db["hang_bay"]

def load_chuyen_bay_df():
    spark = get_spark()

    return (
        spark.read.format("com.mongodb.spark.sql.DefaultSource")
        .option("uri", MONGO_URI)
        .option("database", MONGO_DB)
        .option("collection", "chuyen_bay")
        .load()
    )

def load_tuyen_bay_df():
    spark = get_spark()

    return (
        spark.read.format("com.mongodb.spark.sql.DefaultSource")
        .option("uri", MONGO_URI)
        .option("database", MONGO_DB)
        .option("collection", "tuyen_bay")
        .load()
    )

def load_hang_bay_df():
    spark = get_spark()

    return (
        spark.read.format("com.mongodb.spark.sql.DefaultSource")
        .option("uri", MONGO_URI)
        .option("database", MONGO_DB)
        .option("collection", "hang_bay")
        .load()
    )

@router.post("/add", tags=["chuyen_bay"])
def add_chuyen_bay(chuyen_bay: ChuyenBay):
    print("🔥 Nhận yêu cầu POST /add")
    try:
        print(f"🔥 Dữ liệu nhận được: {chuyen_bay}")

        if not hang_bay_collection.find_one({"ma_hang_bay": chuyen_bay.ma_hang_bay}):
            print(f"❌ Mã hãng bay {chuyen_bay.ma_hang_bay} không tồn tại")
            raise HTTPException(status_code=400, detail="Mã hãng bay không tồn tại")
        if not tuyen_bay_collection.find_one({"ma_tuyen_bay": chuyen_bay.ma_tuyen_bay}):
            print(f"❌ Mã tuyến bay {chuyen_bay.ma_tuyen_bay} không tồn tại")
            raise HTTPException(status_code=400, detail="Mã tuyến bay không tồn tại")

        df = load_chuyen_bay_df()

        if (
            "ma_chuyen_bay" in df.columns
            and df.filter(df["ma_chuyen_bay"] == chuyen_bay.ma_chuyen_bay).count() > 0
        ):
            raise HTTPException(status_code=400, detail="Mã chuyến bay đã tồn tại")

        data_to_insert = chuyen_bay.dict()
        insert_result = chuyen_bay_collection.insert_one(data_to_insert)
        
        # Chuyển datetime thành string để có thể serialize JSON
        data_to_insert["_id"] = str(insert_result.inserted_id)
        data_to_insert["gio_di"] = data_to_insert["gio_di"].strftime("%d/%m/%Y, %H:%M:%S")
        data_to_insert["gio_den"] = data_to_insert["gio_den"].strftime("%d/%m/%Y, %H:%M:%S")
        
        print(f"✅ Thêm chuyến bay thành công: {data_to_insert}")

        return JSONResponse(
            content={
                "message": "Thêm chuyến bay thành công",  # Sửa từ "tuyến bay" thành "chuyến bay"
                "chuyen_bay": data_to_insert,  # Sửa từ "tuyen_bay" thành "chuyen_bay"
            }
        )

    except HTTPException as he:
        raise he

    except Exception as e:
        print(f"❌ Lỗi khi đọc dữ liệu từ MongoDB: {e}")
        raise HTTPException(status_code=500, detail="Lỗi khi đọc dữ liệu từ MongoDB")


@router.get("/get", tags=["chuyen_bay"])
def get_all_chuyen_bay():
    print("🔥 Nhận yêu cầu GET /get")
    try:
        spark = get_spark()

        df_chuyen_bay = load_chuyen_bay_df()
        df_hang_bay = load_hang_bay_df()

        df_tuyen_bay = load_tuyen_bay_df()

        df_chuyen_bay.createOrReplaceTempView("chuyen_bay")
        df_hang_bay.createOrReplaceTempView("hang_bay")
        df_tuyen_bay.createOrReplaceTempView("tuyen_bay")

        query = """
        select 
            cb.ma_chuyen_bay, 
            cb.ma_tuyen_bay, 
            cb.ma_hang_bay, 
            cb.trang_thai,
            cast(cb.gio_di as string) as gio_di, 
            cast(cb.gio_den as string) as gio_den, 
            hb.ten_hang_bay
        from chuyen_bay cb
        left join tuyen_bay tb on cb.ma_tuyen_bay = tb.ma_tuyen_bay
        left join hang_bay hb on cb.ma_hang_bay = hb.ma_hang_bay
        """

        df_result = spark.sql(query)
        pdf = df_result.toPandas()

        # Debug: Xem dữ liệu thô
        print("Dữ liệu thô gio_di:", pdf["gio_di"].iloc[0] if len(pdf) > 0 else "No data")
        
        if len(pdf) > 0:
            # Cách thủ công: Trừ đi 7 tiếng để có giờ đúng
            pdf["gio_di"] = (pd.to_datetime(pdf["gio_di"]) - pd.Timedelta(hours=7)).dt.strftime("%d/%m/%Y, %H:%M:%S")
            pdf["gio_den"] = (pd.to_datetime(pdf["gio_den"]) - pd.Timedelta(hours=7)).dt.strftime("%d/%m/%Y, %H:%M:%S")

        result = pdf.to_dict(orient="records")
        return JSONResponse(content=result)

    except Exception as e:
        print(f"❌ Lỗi khi đọc dữ liệu từ MongoDB: {e}")
        raise HTTPException(status_code=500, detail="Lỗi khi đọc dữ liệu từ MongoDB")
