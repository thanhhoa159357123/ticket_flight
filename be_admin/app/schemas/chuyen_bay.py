from pyspark.sql.types import StructField, StringType, StructType, TimestampType

chuyen_bay_schema = StructType([
    StructField("ma_chuyen_bay", StringType(), True),
    StructField("gio_di", TimestampType(), True),
    StructField("gio_den", TimestampType(), True),
    StructField("trang_thai", StringType(), True),
    StructField("ma_hang_bay", StringType(), True),
    StructField("ma_tuyen_bay", StringType(), True),
])
