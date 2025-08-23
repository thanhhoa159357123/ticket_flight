# be_flightbooking/utils/spark_views.py
from utils.spark import load_df
from pyspark import StorageLevel
from concurrent.futures import ThreadPoolExecutor

cached_views = {}

def load_and_register(name):
    df = load_df(name).persist(StorageLevel.MEMORY_AND_DISK)
    df.createOrReplaceTempView(name)
    df.count()
    cached_views[name] = df

def init_spark_views():
    tables = [
        "ve", "chuyenbay", "hangve", "hangbanve",
        "loaichuyendi", "hangbay", "sanbay", "khachhang", "datve", "chitietdatve", "hanhkhach", "hoadon", "vedientu"
    ]
    print("🚀 Đang khởi tạo Spark views song song...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        executor.map(load_and_register, tables)
    print("✅ Tất cả views đã được khởi tạo!")
