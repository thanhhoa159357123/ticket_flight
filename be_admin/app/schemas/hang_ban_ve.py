from pyspark.sql.types import StructType, StructField, StringType

hang_ban_ve_schema = StructType([
    StructField("ma_hang_ban_ve",StringType(),True),
    StructField("ten_hang_ban_ve",StringType(),True),
    StructField("vai_tro",StringType(),True)
])