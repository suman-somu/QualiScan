import random
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["qualiscan_orders"]

def insert_log(order_id, expected_values, actual_values):
    log_entry = {
        "orderid": order_id,
        "expected_values": expected_values,
        "actual_values": actual_values
    }
    result = db["logs"].insert_one(log_entry)
    if result.inserted_id:
        print(f"Log stored successfully with id: {result.inserted_id}")
    else:
        print("Log could not be stored")