# utils/spark.py
import os

os.environ["PYSPARK_SUBMIT_ARGS"] = (
    "--jars jars/mongo-spark-connector_2.12-3.0.1.jar,"
    "jars/bson-4.2.3.jar,"
    "jars/mongo-java-driver-3.12.10.jar pyspark-shell"
)

from pyspark.sql import SparkSession
from pyspark import SparkConf

spark = None
df_cache = {}  # Cache DataFrame theo tên collection

MONGO_URI = (
    "mongodb+srv://hoachodien913:hoachodien913@cluster0.hogxmh4.mongodb.net/"
    "ticket_flight_booking?retryWrites=true;authSource=admin"
)
MONGO_DB = "ticket_flight_booking"

def init_spark():
    global spark
    if spark is not None:
        return spark

    print("⚙️ Initializing Spark with MongoDB connector...")

    jar1 = os.path.abspath("jars/mongo-spark-connector_2.12-3.0.1.jar")
    jar2 = os.path.abspath("jars/bson-4.2.3.jar")
    jar3 = os.path.abspath("jars/mongo-java-driver-3.12.10.jar")

    conf = (
        SparkConf()
        .setAppName("FlightBookingApp")
        .setMaster("local[2]")
        .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .set("spark.jars", f"{jar1},{jar2},{jar3}")
        .set("spark.mongodb.input.uri", MONGO_URI)
        .set("spark.mongodb.output.uri", MONGO_URI)
        
        # Performance settings
        .set("spark.executor.memory", "1g")
        .set("spark.driver.memory", "512m")
        .set("spark.executor.cores", "2")
        .set("spark.driver.maxResultSize", "200m")
        
        # SQL optimization
        .set("spark.sql.adaptive.enabled", "true")
        .set("spark.sql.adaptive.coalescePartitions.enabled", "true")
        .set("spark.sql.adaptive.advisoryPartitionSizeInBytes", "64MB")
        .set("spark.sql.shuffle.partitions", "8")
        
        # Disable unnecessary features
        .set("spark.ui.enabled", "false")
        .set("spark.eventLog.enabled", "false")
        .set("spark.sql.execution.arrow.pyspark.enabled", "false")
        
        # MongoDB optimization
        .set("spark.mongodb.input.readPreference.name", "secondaryPreferred")
        .set("spark.mongodb.input.partitioner", "MongoPaginateByCountPartitioner")
        .set("spark.mongodb.input.partitionerOptions.partitionSizeMB", "32")
    )

    try:
        spark = SparkSession.builder.config(conf=conf).getOrCreate()
        spark.sparkContext.setLogLevel("ERROR")
        print("✅ Spark initialized successfully!")
        return spark
    except Exception as e:
        print(f"❌ Spark initialization error: {e}")
        raise

def get_spark():
    if spark is None:
        return init_spark()
    return spark

def load_df(collection_name: str, force_reload: bool = False):
    """Load DataFrame from MongoDB with caching - OPTIMIZED"""
    global df_cache
    
    if not force_reload and collection_name in df_cache:
        print(f"⚡ Using cached {collection_name}")
        return df_cache[collection_name]

    if spark is None:
        init_spark()
        
    try:
        print(f"🔄 Loading {collection_name} from MongoDB...")
        
        df = (
            spark.read.format("com.mongodb.spark.sql.DefaultSource")
            .option("uri", MONGO_URI)
            .option("database", MONGO_DB)
            .option("collection", collection_name)
            .option("spark.mongodb.input.readPreference.name", "secondaryPreferred")
            .load()
        )
        
        # Cache immediately với MEMORY_AND_DISK để tối ưu
        from pyspark import StorageLevel
        df = df.persist(StorageLevel.MEMORY_AND_DISK)
        
        # 🔥 ASYNC COUNT để không block thread chính
        import threading
        
        def count_async():
            try:
                count = df.count()
                print(f"✅ Cached {collection_name}: {count} records")
            except Exception as e:
                print(f"⚠️ Count error for {collection_name}: {e}")
        
        # Count trong background thread
        threading.Thread(target=count_async, daemon=True).start()
        
        df_cache[collection_name] = df
        print(f"⚡ {collection_name} cached successfully")
        return df
        
    except Exception as e:
        print(f"❌ Error loading {collection_name}: {e}")
        raise

def refresh_cache(collection_name: str, lazy_reload: bool = True):
    """Refresh cache for specific collection với lazy loading"""
    if collection_name in df_cache:
        try:
            df_cache[collection_name].unpersist()
        except Exception:
            pass
        del df_cache[collection_name]
        print(f"🗑️ Cache invalidated: {collection_name}")
    
    if not lazy_reload:
        # Immediate reload (chỉ khi cần thiết)
        return load_df(collection_name, force_reload=True)
    else:
        # Lazy reload - sẽ load khi cần
        print(f"⏳ Lazy invalidation: {collection_name} sẽ reload khi được gọi")
        return None

def invalidate_cache(collection_name: str):
    """Chỉ invalidate cache, không reload ngay"""
    if collection_name in df_cache:
        try:
            df_cache[collection_name].unpersist()
        except Exception:
            pass
        del df_cache[collection_name]
        print(f"❌ Cache invalidated: {collection_name}")

def clear_all_cache():
    """Clear all cached DataFrames"""
    global df_cache
    for collection_name in list(df_cache.keys()):
        try:
            df_cache[collection_name].unpersist()
        except Exception:
            pass
    df_cache.clear()
    print("🧹 All cache cleared")

def preload_collections(collections: list):
    """Preload multiple collections into cache"""
    results = {}
    for collection in collections:
        try:
            df = load_df(collection)
            count = df.count()
            results[collection] = {"status": "success", "count": count}
        except Exception as e:
            results[collection] = {"status": "error", "error": str(e)}
    return results

def get_cache_status():
    """Get current cache status"""
    cache_info = {}
    for collection_name, df in df_cache.items():
        try:
            count = df.count()
            storage_level = str(df.storageLevel)
            cache_info[collection_name] = {
                "cached": True,
                "record_count": count,
                "storage_level": storage_level
            }
        except Exception as e:
            cache_info[collection_name] = {"cached": False, "error": str(e)}
    
    return {
        "cached_collections": list(df_cache.keys()),
        "cache_count": len(df_cache),
        "cache_details": cache_info
    }