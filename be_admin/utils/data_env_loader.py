import os
from dotenv import load_dotenv
print("🔧 Đang tải biến môi trường từ file data.env...")
load_dotenv(dotenv_path="data.env", override=True)
# load_dotenv()
print("✅ Biến môi trường của data.env đã được tải thành công!")
MONGODA_URI = os.getenv("MONGODA_URI")
MONGODA_DB = os.getenv("MONGODA_DB")