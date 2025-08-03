from pyspark.sql.types import StructType, StructField, StringType

hang_bay_schema = StructType([
    StructField("ma_hang_bay", StringType(), True),
    StructField("ten_hang_bay", StringType(), True),
    StructField("iata_code", StringType(), True),
    StructField("quoc_gia", StringType(), True),
])