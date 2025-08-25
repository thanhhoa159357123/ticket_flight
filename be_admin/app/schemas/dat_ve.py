from pyspark.sql.types import StructType, StructField, StringType, TimestampType

dat_ve_schema = StructType([
    StructField("ma_dat_ve", StringType(), True),
    StructField("ngay_dat", StringType(), True),
    StructField("trang_thai", StringType(), True),
    StructField("ma_khach_hang", StringType(), True),
    StructField("loai_chuyen_di", StringType(), True),
    StructField("ma_hang_ve", StringType(), True),
    StructField("ma_chuyen_bay", StringType(), True),
])
