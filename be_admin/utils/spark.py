import os

os.environ["PYSPARK_SUBMIT_ARGS"] = (
    "--jars jars/mongo-spark-connector_2.12-3.0.1.jar,"
    "jars/bson-4.2.3.jar,"
    "jars/mongo-java-driver-3.12.10.jar pyspark-shell"
)

from pyspark.sql import SparkSession
from pyspark import SparkConf

spark = None
df_cache = {}  # 🔥 Caching DataFrame theo tên collection

MONGO_URI = (
    "mongodb+srv://hoachodien913:hoachodien913@cluster0.hogxmh4.mongodb.net/"
    "ticket_flight_booking?retryWrites=true;authSource=admin"
)

def init_spark():
    global spark
    if spark is not None:
        return

    print("⚙️ Đang khởi tạo SparkSession với MongoDB connector...")

    jar1 = os.path.abspath("jars/mongo-spark-connector_2.12-3.0.1.jar")
    jar2 = os.path.abspath("jars/bson-4.2.3.jar")
    jar3 = os.path.abspath("jars/mongo-java-driver-3.12.10.jar")
    

    spark = (
        SparkSession.builder
        .appName("FlightBookingApp")
        .master("local[*]")
        .config("spark.jars.packages","org.mongodb.spark:mongo-spark-connector_2.12:10.1.1")
        .config("spark.mongodb.read.connection.uri", MONGO_URI)
        .config("spark.mongodb.write.connection.uri", MONGO_URI)
        .getOrCreate()
    )
    spark.sparkContext.setLogLevel("ERROR")
    print("✅ SparkSession đã được khởi tạo thành công!")


def get_spark():
    if spark is None:
        init_spark()
    return spark


def load_df(collection_name: str):
    global df_cache
    spark = get_spark()  # 🔧 Đảm bảo SparkSession đã được khởi tạo

    if collection_name in df_cache:
        print(f"🧠 [CACHE] Dùng lại DataFrame cache: {collection_name}")
        return df_cache[collection_name]

    print(f"🔁 [LOAD] Đang load mới từ MongoDB: {collection_name}")
    df = (
        spark.read.format("mongodb")
        .option("database", "ticket_flight_booking")
        .option("collection", collection_name)
        .load()
        .persist()
    )
    df.count()  # Force trigger load
    df_cache[collection_name] = df
    return df


def invalidate_cache(collection_name: str):
    global df_cache
    if collection_name in df_cache:
        print(f"♻️ [INVALIDATE] Xoá cache DataFrame: {collection_name}")
        del df_cache[collection_name]