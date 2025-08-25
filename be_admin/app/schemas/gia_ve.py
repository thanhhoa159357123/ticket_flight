from pyspark.sql.types import StructType, StructField, StringType, FloatType

gia_ve_schema = StructType([
    StructField("ma_ve", StringType(), True),
    StructField("gia_ve", FloatType(), True),
    StructField("ma_hang_ve", StringType(), True),
    StructField("ma_chuyen_bay", StringType(), True),
    StructField("ma_hang_ban_ve", StringType(), True),
])
