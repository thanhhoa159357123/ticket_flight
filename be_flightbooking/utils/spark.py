# be_flightbooking/utils/spark.py
import os

os.environ["PYSPARK_SUBMIT_ARGS"] = (
    "--jars jars/mongo-spark-connector_2.12-3.0.1.jar,"
    "jars/bson-4.2.3.jar,"
    "jars/mongo-java-driver-3.12.10.jar pyspark-shell"
)

from pyspark.sql import SparkSession
from pyspark import SparkConf, StorageLevel
from concurrent.futures import ThreadPoolExecutor
spark = None
df_cache = {}

MONGO_URI = (
    "mongodb+srv://hoachodien913:hoachodien913@cluster0.hogxmh4.mongodb.net/"
    "ticket_flight_booking?retryWrites=true;authSource=admin"
)
MONGO_DB = "ticket_flight_booking"


def init_spark():
    global spark
    if spark is not None:
        return

    print("⚙️ Đang khởi tạo SparkSession...")

    jar1 = os.path.abspath("jars/mongo-spark-connector_2.12-3.0.1.jar")
    jar2 = os.path.abspath("jars/bson-4.2.3.jar")
    jar3 = os.path.abspath("jars/mongo-java-driver-3.12.10.jar")

    conf = (
        SparkConf()
        .setAppName("FlightBookingApp")
        .setMaster("local[*]")  # Dùng tối đa CPU
        .set("spark.driver.memory", "8g")  # RAM cho driver
        .set("spark.driver.maxResultSize", "4g")
        .set("spark.sql.shuffle.partitions", "8")
        .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .set("spark.kryoserializer.buffer.max", "512m")
        .set("spark.sql.execution.arrow.pyspark.enabled", "true")
        .set("spark.jars", f"{jar1},{jar2},{jar3}")
        .set("spark.mongodb.input.uri", MONGO_URI)
        .set("spark.mongodb.output.uri", MONGO_URI)
    )

    spark = SparkSession.builder.config(conf=conf).getOrCreate()
    spark.sparkContext.setLogLevel("ERROR")
    print("✅ SparkSession đã được khởi tạo thành công!")


def get_spark():
    if spark is None:
        init_spark()
    return spark


def load_df(collection_name: str):
    global df_cache

    if collection_name in df_cache:
        print(f"🧠 [CACHE] Dùng lại DataFrame cache: {collection_name}")
        return df_cache[collection_name]

    print(f"🔄 [LOAD] Đang load mới từ MongoDB: {collection_name}")
    df = (
        spark.read.format("com.mongodb.spark.sql.DefaultSource")
        .option("uri", MONGO_URI)
        .option("database", MONGO_DB)
        .option("collection", collection_name)
        .load()
        .repartition(8)
        .persist(StorageLevel.MEMORY_AND_DISK)
    )
    df.count()  # Bắt Spark đọc ngay từ MongoDB lần đầu
    df_cache[collection_name] = df
    return df


def invalidate_cache(collection_name: str):
    global df_cache

    if collection_name in df_cache:
        print(f"♻️ [INVALIDATE] Xoá cache DataFrame: {collection_name}")
        df_cache[collection_name].unpersist(blocking=True)
        del df_cache[collection_name]

    # Load lại DataFrame mới nhất từ Mongo
    print(f"🔄 [REFRESH] Đang load lại dữ liệu cho: {collection_name}")
    new_df = (
        spark.read.format("com.mongodb.spark.sql.DefaultSource")
        .option("uri", MONGO_URI)
        .option("database", MONGO_DB)
        .option("collection", collection_name)
        .load()
        .repartition(8)
        .persist(StorageLevel.MEMORY_AND_DISK)
    )
    new_df.count()
    df_cache[collection_name] = new_df
    return new_df

def preload_collections():
    collections = [
        "khachhang", "chuyenbay", "sanbay", "hangbay",
        "hangbanve", "loaichuyendi", "hangve", "ve"
    ]
    print("🚀 Đang preload cache Spark...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(load_df, collections))
    print("✅ Preload cache hoàn tất!")
