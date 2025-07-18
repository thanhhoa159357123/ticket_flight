import os
from dotenv import load_dotenv
print("🔧 Đang tải biến môi trường từ file .env...")

load_dotenv(dotenv_path=".env", override=True)
# load_dotenv()
print("✅ Biến môi trường của .env đã được tải thành công!")
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

