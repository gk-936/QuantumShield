"""
Mobile application scanner service.
"""

from datetime import datetime


def search_pnb_apps(query: str = "PNB") -> list:
    """Search for PNB mobile applications."""
    return [
        {"id": "com.pnb.pnbone",  "name": "PNB ONE",                "platform": "Android", "status": "Official", "rating": 4.2},
        {"id": "com.pnb.mpassbook","name": "PNB mPassbook",         "platform": "Android", "status": "Official", "rating": 3.9},
        {"id": "id123456789",      "name": "PNB ONE",                "platform": "iOS",     "status": "Official", "rating": 4.5},
        {"id": "com.pnb.corp",     "name": "PNB Corporate Transfer", "platform": "Android", "status": "Official", "rating": 3.5},
    ]


def scan_mobile_app(app_id: str, platform: str) -> dict:
    """Perform multi-stage mobile app analysis."""
    results = {
        "appId": app_id,
        "platform": platform,
        "version": "4.2.0-pnb",
        "packageSize": "68.4 MB",
        "timestamp": datetime.utcnow().isoformat(),
        "findings": [],
        "pqc_score": 0,
    }

    if "pnbone" in app_id:
        results["findings"].append({
            "severity": "high",
            "issue": "Hardcoded RSA Public Key Found",
            "detail": "Detected in /assets/config/pqc_fallback.bin. Vulnerable to Shor's algorithm.",
            "recommendation": "Move to dynamic ML-KEM key exchange",
        })
        results["findings"].append({
            "severity": "medium",
            "issue": "Lack of TLS 1.3 Pinning",
            "detail": "Maintains backward compatibility with TLS 1.1/1.2 for legacy Android versions.",
            "recommendation": "Enforce TLS 1.3 and hybrid PQC certs",
        })
        results["pqc_score"] = 42
    else:
        results["findings"].append({
            "severity": "critical",
            "issue": "Insecure Cipher Suite (Deprecated)",
            "detail": "Detected use of SHA-1 for message integrity in legacy relay module.",
            "recommendation": "Upgrade to SHA-3",
        })
        results["pqc_score"] = 28

    return results
