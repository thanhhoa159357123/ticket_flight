import sys, os
from utils.env_loader import MONGO_DB, MONGO_URI
from utils.data_env_loader import MONGODA_DB, MONGODA_URI


from pymongo import MongoClient
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse


def print_env_variables():
    print("Environment Variables:")
    print("MONGO_DB:", MONGO_DB)
    print("MONGO_URI:", MONGO_URI)
    print("MONGODA_DB:", MONGODA_DB)
    print("MONGODA_URI:", MONGODA_URI)

if __name__ == "__main__":
    print_env_variables()