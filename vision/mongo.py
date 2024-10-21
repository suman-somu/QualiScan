import random
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# MongoDB Atlas connection string
# Load environment variables from .env file
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["qualiscan_orders"]  # Define the database you want to use

def insert_log(order_id, expected_values, actual_values):
    log_entry = {
        "orderid": order_id,
        "expected_values": expected_values,  # Now an array of objects
        "actual_values": actual_values       # Now an array of objects
    }
    result = db["logs"].insert_one(log_entry)  # Insert data into the "logs" collection
    if result.inserted_id:
        print(f"Log stored successfully with id: {result.inserted_id}")
    else:
        print("Log could not be stored")