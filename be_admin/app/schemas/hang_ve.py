from pyspark.sql.types import StructType, StructField, StringType, IntegerType, BooleanType

hang_ve_schema = StructType([
    StructField("ma_hang_ve", StringType(), True),
    StructField("ten_hang_ve", StringType(), True),
    StructField("so_kg_hanh_ly_ky_gui", IntegerType(), True),
    StructField("so_kg_hanh_ly_xach_tay", IntegerType(), True),
    StructField("so_do_ghe", StringType(), True),
    StructField("khoang_cach_ghe", StringType(), True),
    StructField("refundable", BooleanType(), True),
    StructField("changeable", BooleanType(), True),
])
