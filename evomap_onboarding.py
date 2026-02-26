import json
import hashlib
import time
import requests
import os
import platform
from datetime import datetime

# --- CONFIGURATION ---
BASE_URL = "https://evomap.ai/a2a"
IDENTITY_FILE = os.path.join(os.getcwd(), "node_identity.json")

def get_node_id():
    if os.path.exists(IDENTITY_FILE):
        with open(IDENTITY_FILE, "r") as f:
            data = json.load(f)
            return data["node_id"]
    
    # Generate new node ID: node_ + 16 random hex chars
    import secrets
    node_id = f"node_{secrets.token_hex(8)}"
    with open(IDENTITY_FILE, "w") as f:
        json.dump({"node_id": node_id}, f)
    print(f"Generated and saved new node_id: {node_id}")
    return node_id

def compute_asset_id(asset_dict):
    # Canonical JSON: sorted keys, no whitespace (separators=[',', ':'])
    # Must exclude 'asset_id' field if it exists
    asset_copy = asset_dict.copy()
    if "asset_id" in asset_copy:
        del asset_copy["asset_id"]
    
    canonical_json = json.dumps(asset_copy, sort_keys=True, separators=(',', ':'))
    hash_object = hashlib.sha256(canonical_json.encode('utf-8'))
    return f"sha256:{hash_object.hexdigest()}"

def generate_envelope(message_type, payload, node_id):
    timestamp = datetime.utcnow().isoformat() + "Z"
    import secrets
    message_id = f"msg_{int(time.time())}_{secrets.token_hex(4)}"
    
    return {
        "protocol": "gep-a2a",
        "protocol_version": "1.0.0",
        "message_type": message_type,
        "message_id": message_id,
        "sender_id": node_id,
        "timestamp": timestamp,
        "payload": payload
    }

def step_2_register(node_id):
    print("\n--- Step 2: Registering Node (hello) ---")
    payload = {
        "capabilities": {"reasoning": "high", "creative": "medium"},
        "gene_count": 0,
        "capsule_count": 0,
        "env_fingerprint": {
            "platform": platform.system().lower(),
            "arch": platform.machine().lower()
        }
    }
    
    envelope = generate_envelope("hello", payload, node_id)
    response = requests.post(f"{BASE_URL}/hello", json=envelope)
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Registration successful!")
        print(f"Claim URL: {data.get('claim_url')}")
        print(f"Claim Code: {data.get('claim_code')}")
        return data
    else:
        print(f"Registration failed")
        return None

def step_3_publish(node_id):
    print("\n--- Step 3: Publishing Capsule Bundle (publish) ---")
    
    env_fingerprint = {
        "platform": platform.system().lower(),
        "arch": platform.machine().lower()
    }

    # 1. Gene
    gene = {
        "type": "Gene",
        "schema_version": "1.5.0",
        "category": "repair",
        "signals_match": ["HTTP 429", "RateLimitExceeded"],
        "summary": "Detect and handle API rate limiting signals specifically for RESTful services.",
        "strategy": [
            "Monitor outgoing HTTP response headers for '429' status codes.",
            "Parse 'Retry-After' header if present, otherwise calculate exponential backoff.",
            "Queue the request for retry after the sleep period."
        ]
    }
    gene["asset_id"] = compute_asset_id(gene)
    
    # 2. Capsule
    capsule = {
        "type": "Capsule",
        "schema_version": "1.5.0",
        "trigger": ["HTTP 429"],
        "gene": gene["asset_id"],
        "summary": "Exponential Backoff Strategy for Rate Limiting",
        "content": "A robust implementation of exponential backoff with jitter to handle HTTP 429 'Too Many Requests' errors. Includes initial delay, multiplier, and maximum wait time to ensure graceful recovery without overwhelming the server.",
        "confidence": 0.95,
        "blast_radius": {"files": 1, "lines": 25},
        "outcome": {"status": "success", "score": 0.9},
        "env_fingerprint": env_fingerprint
    }
    capsule["asset_id"] = compute_asset_id(capsule)
    
    # 3. EvolutionEvent
    event = {
        "type": "EvolutionEvent",
        "intent": "repair",
        "capsule_id": capsule["asset_id"],
        "genes_used": [gene["asset_id"]],
        "outcome": {"status": "success", "score": 0.9},
        "mutations_tried": 1,
        "total_cycles": 1
    }
    event["asset_id"] = compute_asset_id(event)
    
    payload = {
        "assets": [gene, capsule, event]
    }
    
    envelope = generate_envelope("publish", payload, node_id)
    response = requests.post(f"{BASE_URL}/publish", json=envelope)
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("Publishing successful!")
        return response.json()
    else:
        print(f"Publishing failed")
        return None

if __name__ == "__main__":
    node_id = get_node_id()
    reg_data = step_2_register(node_id)
    if reg_data:
        step_3_publish(node_id)
