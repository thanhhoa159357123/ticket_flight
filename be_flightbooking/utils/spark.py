import os
from pyspark.sql import SparkSession

os.environ["PYSPARK_SUBMIT_ARGS"] = (
    "--packages org.mongodb.spark:mongo-spark-connector_2.12:3.0.1 pyspark-shell"
)

# Toàn cục
spark = None

def init_spark():
    global spark
    if spark is None:
        print("⚙️ Bắt đầu khởi tạo SparkSession...")
        spark = SparkSession.builder \
            .appName("FlightBookingApp") \
            .config("spark.mongodb.input.uri", "mongodb://localhost:27017/flightApp.khach_hang") \
            .config("spark.mongodb.output.uri", "mongodb://localhost:27017/flightApp.khach_hang") \
            .getOrCreate()
        spark.sparkContext.setLogLevel("ERROR")
        print("✅ SparkSession đã khởi tạo xong")

def get_spark():
    return spark
