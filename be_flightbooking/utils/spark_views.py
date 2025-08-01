# utils/spark_views.py
from utils.spark import load_df
from pyspark import StorageLevel

cached_views = {}

def init_spark_views():
    tables = [
        "gia_ve", "chuyen_bay", "tuyen_bay", "hang_ve", 
        "hang_ban_ve", "loai_chuyen_di", "hang_bay", "san_bay", "khach_hang", "dat_ve", "gia_ve"
    ]
    for name in tables:
        df = load_df(name).persist(StorageLevel.MEMORY_AND_DISK)
        df.createOrReplaceTempView(name)
        df.count()
        cached_views[name] = df
