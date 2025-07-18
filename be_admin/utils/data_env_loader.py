import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODA_URI")
MONGO_DB = os.getenv("MONGODA_DB")