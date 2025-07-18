def read_mongo_collection(collection_name: str):
    from be_admin.utils.spark import get_spark
    spark = get_spark()

    return spark.read \
        .format("mongo") \
        .option("collection", collection_name) \
        .load()