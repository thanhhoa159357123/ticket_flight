from pyspark.sql.types import StructType, StructField, StringType, BooleanType

khach_hang_schema = StructType([
    StructField("ten_khach_hang", StringType(), True),
    StructField("so_dien_thoai", StringType(), True),
    StructField("email", StringType(), True),
    StructField("matkhau", StringType(), True),
    StructField("ma_khach_hang", StringType(), True),
    StructField("is_active", BooleanType(), True),
    StructField("da_dat_ve", BooleanType(), True),
    StructField("deleted_at", StringType(), True),
    StructField("last_active_at", StringType(), True),
    StructField("created_at", StringType(), True),
])
