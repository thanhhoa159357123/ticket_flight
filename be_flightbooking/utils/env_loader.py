# utils/env_loader.py
from dotenv import load_dotenv
import os
from functools import lru_cache

# Load env một lần duy nhất
load_dotenv()

@lru_cache(maxsize=None)
def get_mongo_uri():
    """Cache MongoDB URI để tránh os.getenv() nhiều lần"""
    return os.getenv("MONGO_URI")

@lru_cache(maxsize=None)
def get_mongo_db():
    """Cache MongoDB database name"""
    return os.getenv("MONGO_DB")

# Backward compatibility
MONGO_URI = get_mongo_uri()
MONGO_DB = get_mongo_db()

# Validation
if not MONGO_URI:
    raise ValueError("MONGO_URI không được tìm thấy trong environment variables")
if not MONGO_DB:
    raise ValueError("MONGO_DB không được tìm thấy trong environment variables")