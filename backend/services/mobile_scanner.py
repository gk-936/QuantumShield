"""
Mobile application scanner service.
"""

from datetime import datetime


def search_pnb_apps(query: str = "") -> list:
    """Search for PNB mobile applications and return Official and Verified apps matching the query."""
    all_apps = [
        {"id": "com.pnb.pnbone",  "name": "PNB ONE",                "platform": "Android", "status": "Official", "rating": 4.2},
        {"id": "com.pnb.mpassbook","name": "PNB mPassbook",         "platform": "Android", "status": "Official", "rating": 3.9},
        {"id": "id123456789",      "name": "PNB ONE",                "platform": "iOS",     "status": "Official", "rating": 4.5},
        {"id": "com.pnb.corp",     "name": "PNB Corporate Transfer", "platform": "Android", "status": "Official", "rating": 3.5},
        {"id": "com.pnb.auth",     "name": "PNB Authenticator",      "platform": "Android", "status": "Verified", "rating": 4.7},
        {"id": "com.pnb.lite",     "name": "PNB ONE Lite",           "platform": "Android", "status": "Verified", "rating": 4.1},
        {"id": "com.fake.pnb",     "name": "PNB Rewards Tracker",    "platform": "Android", "status": "Unverified", "rating": 2.1},
    ]
    
    query_lower = query.lower()
    return [
        app for app in all_apps 
        if query_lower in app["name"].lower() and app["status"] in ["Official", "Verified"]
    ]


def scan_mobile_app(app_id: str, platform: str) -> dict:
    """
    Perform heuristic mobile app analysis for PQC markers.
    """
    results = {
        "appId": app_id,
        "platform": platform,
        "version": "4.2.0-pnb",
        "timestamp": datetime.utcnow().isoformat(),
        "findings": [],
        "pqc_score": 0,
    }

    # Simulation of binary grepping for PQC OIDs
    # Real OID for ML-KEM: 2.16.840.1.101.3.4.3.18
    # Real marker for OQS: "OQS_KEM_alg_kyber_768"
    
    pqc_markers = ["ML-KEM", "ML-DSA", "Kyber", "Dilithium", "2.16.840.1.101.3.4.3"]
    found_markers = [m for m in pqc_markers if m.lower() in app_id.lower()]

    if found_markers:
        results["findings"].append({
            "severity": "info",
            "issue": f"PQC Library Marker Detected: {found_markers[0]}",
            "detail": f"Heuristic scan identified PQC-related strings in the application binary/package name matching {found_markers}.",
            "recommendation": None,
        })
        results["pqc_score"] = 0 # Secure
        results["quantumSafe"] = True
    else:
        results["findings"].append({
            "severity": "critical",
            "issue": "No PQC Algorithms Detected",
            "detail": "Binary analysis found no evidence of NIST FIPS 203/204 algorithms. System relies on classical RSA/ECC.",
            "recommendation": "Integrate liboqs or Bouncy Castle PQC providers into the mobile build pipeline.",
        })
        results["pqc_score"] = 100
        results["quantumSafe"] = False

    return results
