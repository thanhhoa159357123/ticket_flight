from utils.env_loader import MONGO_DB, MONGO_URI
from pymongo import MongoClient

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
admin_collection = client[MONGO_DB]["User"]