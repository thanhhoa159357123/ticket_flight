import os

# Nạp JARs đúng cấu trúc (đừng thiếu mongo-java-driver)
os.environ["PYSPARK_SUBMIT_ARGS"] = (
    "--jars jars/mongo-spark-connector_2.12-3.0.1.jar,"
    "jars/bson-4.2.3.jar,"
    "jars/mongo-java-driver-3.12.10.jar pyspark-shell"
)
# Ép JAVA_HOME và SPARK_HOME rõ ràng
# os.environ["JAVA_HOME"] = r"C:\Java\jdk-11"
# os.environ["SPARK_HOME"] = r"C:\spark\spark-3.3.2-bin-hadoop3"
# os.environ["PATH"] = (
#     r"C:\Java\jdk-11\bin;" +
#     r"C:\spark\spark-3.3.2-bin-hadoop3\bin;" +
#     os.environ["PATH"]
# )

from pyspark.sql import SparkSession
from pyspark import SparkConf


spark = None

MONGO_URI = (
    "mongodb+srv://hoachodien913:hoachodien913@cluster0.hogxmh4.mongodb.net/"
    "ticket_flight_booking?retryWrites=true;authSource=admin"
)


def init_spark():
    global spark
    if spark is not None:
        return

    print("⚙️ Đang khởi tạo SparkSession với MongoDB connector...")

    try:
        jar1 = os.path.abspath("jars/mongo-spark-connector_2.12-3.0.1.jar")
        jar2 = os.path.abspath("jars/bson-4.2.3.jar")
        jar3 = os.path.abspath("jars/mongo-java-driver-3.12.10.jar")
        print(f"📦 JARs: \n- {jar1}\n- ")

        # if not os.path.exists(jar1) or not os.path.exists(jar2):
        #     raise FileNotFoundError("❌ Thiếu file JAR cần thiết!")

        conf = (
            SparkConf()
            .setAppName("FlightBookingApp")
            .setMaster("local[*]")
            .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
            .set("spark.jars", f"{jar1}, {jar2}, {jar3}")
            .set("spark.mongodb.input.uri", MONGO_URI)
            .set("spark.mongodb.output.uri", MONGO_URI)
        )
        spark = SparkSession.builder.config(conf=conf).getOrCreate()
        spark.sparkContext.setLogLevel("ERROR")
        print("✅ SparkSession đã được khởi tạo thành công!")

    except Exception as e:
        import traceback

        traceback.print_exc()
        print(f"❌ Lỗi khởi tạo Spark: {e}")
        spark = None


def get_spark():
    if spark is None:
        init_spark()
    if spark is None:
        raise RuntimeError("⚠️ Spark chưa được khởi tạo.")
    return spark
