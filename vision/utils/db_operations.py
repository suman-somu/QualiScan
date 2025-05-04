from ..config.mongo import db

def get_next_order_id() -> int:
    """Get the next order ID by counting existing documents"""
    return db["logs"].count_documents({}) + 1

def store_order_log_in_db(order_id: int, expected_values: list, actual_values: dict) -> None:
    """Insert a new log record into the database"""
    db["logs"].insert_one({
        "order_id": order_id,
        "expected_values": expected_values,
        "actual_values": actual_values
    })
