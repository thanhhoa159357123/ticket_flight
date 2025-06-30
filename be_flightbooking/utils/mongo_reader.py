def read_collection(collection_name: str):
    from utils.spark import get_spark
    spark = get_spark()

    return spark.read \
        .format("mongo") \
        .option("collection", collection_name) \
        .load()
