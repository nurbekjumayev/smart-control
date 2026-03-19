import datetime
import json
import os

LOG_FILE = "audit_log.jsonl"

def log_action(user_id: str, action: str, details: dict, ip_address: str = "127.0.0.1"):
    """
    Logs an action to an immutable JSONL file.
    In a real system, this would write to a write-once table in PostgreSQL.
    """
    log_entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "user_id": user_id,
        "action": action,
        "details": details,
        "ip_address": ip_address,
        "hash": "---SIMULATED_IMMUTABLE_HASH---" 
    }
    
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")
    
    print(f"[AUDIT] {user_id} performed {action}")
