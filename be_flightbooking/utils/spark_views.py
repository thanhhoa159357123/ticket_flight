# utils/spark_views.py
from utils.spark import load_df, get_spark
from pyspark import StorageLevel
import concurrent.futures
import threading

cached_views = {}
_views_lock = threading.Lock()

def init_spark_views():
    """Initialize Spark views with parallel loading"""
    with _views_lock:
        if cached_views:  # Already initialized
            print("✅ Spark views đã được khởi tạo trước đó")
            return cached_views

        tables = [
            "khach_hang", "chuyen_bay", "san_bay", "hang_bay", 
            "hang_ban_ve", "loai_chuyen_di", "tuyen_bay", "hang_ve", 
            "gia_ve", "dat_ve"  # Removed duplicate "gia_ve"
        ]
        
        spark = get_spark()
        
        def create_view(table_name):
            """Create view for a table"""
            try:
                print(f"🔄 Creating view: {table_name}")
                df = load_df(table_name).persist(StorageLevel.MEMORY_AND_DISK)
                df.createOrReplaceTempView(table_name)
                
                # Trigger materialization
                count = df.count()
                print(f"✅ View {table_name} created with {count} records")
                
                return table_name, df
            except Exception as e:
                print(f"❌ Error creating view {table_name}: {e}")
                return table_name, None

        # Parallel view creation for better performance
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(create_view, table) for table in tables]
            
            for future in concurrent.futures.as_completed(futures):
                table_name, df = future.result()
                if df is not None:
                    cached_views[table_name] = df

        print(f"✅ Khởi tạo thành công {len(cached_views)} Spark views!")
        return cached_views

def get_view(table_name: str):
    """Get cached view DataFrame"""
    if table_name not in cached_views:
        print(f"⚠️ View {table_name} chưa được khởi tạo")
        return None
    return cached_views[table_name]

def refresh_view(table_name: str):
    """Refresh specific view"""
    with _views_lock:
        if table_name in cached_views:
            try:
                cached_views[table_name].unpersist()
            except Exception:
                pass
            del cached_views[table_name]
        
        # Recreate view
        df = load_df(table_name, force_reload=True).persist(StorageLevel.MEMORY_AND_DISK)
        df.createOrReplaceTempView(table_name)
        cached_views[table_name] = df
        print(f"♻️ Refreshed view: {table_name}")
