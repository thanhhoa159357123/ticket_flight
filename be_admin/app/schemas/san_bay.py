from pyspark.sql.types import StructField, StructType, StringType

san_bay_schema = StructType([
    StructField("ma_san_bay",StringType(),True),
    StructField("ten_san_bay",StringType(),True),
    StructField("thanh_pho",StringType(),True),
    StructField("ma_quoc_gia",StringType(),True),
    StructField("iata_code",StringType(),True)
])