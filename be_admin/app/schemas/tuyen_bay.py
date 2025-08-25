from pyspark.sql.types import StringType, StructField, StructType

tuyen_bay_schema = StructType([
    StructField("ma_tuyen_bay",StringType(),True),
    StructField("ma_san_bay_di",StringType(),True),
    StructField("ma_san_bay_den",StringType(),True)
])