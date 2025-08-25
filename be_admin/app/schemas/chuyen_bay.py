from pyspark.sql.types import StructType, StructField, StringType, TimestampType

chuyen_bay_schema = StructType([
    StructField("ma_chuyen_bay", StringType(), nullable=False),
    StructField("thoi_gian_di", TimestampType(), nullable=False),
    StructField("thoi_gian_den", TimestampType(), nullable=False),
    StructField("ma_hang_bay", StringType(), nullable=False),
    StructField("ma_san_bay_di", StringType(), nullable=False),
    StructField("ma_san_bay_den", StringType(), nullable=False),
])