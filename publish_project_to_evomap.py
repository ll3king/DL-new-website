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
KNOWLEDGE_FILE = r"C:\Users\61413\.gemini\antigravity\brain\7373eb33-0a18-419b-9aad-84a3f9920488\project_knowledge_base.md"

def get_node_id():
    if os.path.exists(IDENTITY_FILE):
        with open(IDENTITY_FILE, "r") as f:
            data = json.load(f)
            return data["node_id"]
    return None

def compute_asset_id(asset_dict):
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

def publish_knowledge(node_id):
    if not os.path.exists(KNOWLEDGE_FILE):
        print(f"Error: Knowledge file not found at {KNOWLEDGE_FILE}")
        return

    # with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
    #     knowledge_content = f.read().strip()
    
    knowledge_content = "Dandy Lane Sanctuary Website: AI Logic & Mobile Performance Experience recording."

    print("\n--- Publishing Project Knowledge to EvoMap (TEST) ---")
    
    env_fingerprint = {
        "platform": platform.system().lower(),
        "arch": platform.machine().lower()
    }

    # 1. Gene
    gene = {
        "type": "Gene",
        "schema_version": "1.5.0",
        "category": "architectural_pattern",
        "signals_match": ["AI Hallucination", "Reservation Logic"],
        "summary": "Implementation patterns for deterministic AI business logic.",
        "strategy": [
            "Enforce constraints in Tool Function code."
        ]
    }
    gene["asset_id"] = compute_asset_id(gene)
    
    # 2. Capsule
    capsule = {
        "type": "Capsule",
        "schema_version": "1.5.0",
        "trigger": ["Project Post-Mortem"],
        "gene": gene["asset_id"],
        "summary": "Dandy Lane Project Knowledge",
        "content": knowledge_content,
        "confidence": 0.95,
        "blast_radius": {"files": 1, "lines": 25},
        "outcome": {"status": "success", "score": 0.9},
        "env_fingerprint": env_fingerprint
    }
    capsule["asset_id"] = compute_asset_id(capsule)
    
    # 3. EvolutionEvent
    event = {
        "type": "EvolutionEvent",
        "intent": "share_knowledge",
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
    
    print(f"DEBUG: Gene ID: {gene['asset_id']}")
    print(f"DEBUG: Capsule ID: {capsule['asset_id']}")
    
    response = requests.post(f"{BASE_URL}/publish", json=envelope)
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        print("Knowledge published successful to EvoMap!")
        return response.json()
    else:
        print(f"Publishing failed")
        return None

if __name__ == "__main__":
    node_id = get_node_id()
    if node_id:
        publish_knowledge(node_id)
    else:
        print("Node ID not found. Please run onboarding first.")
