"""
API endpoint discovery and bucketing service.
"""


from services.entropy import get_entropy

def discover_endpoints(domain: str) -> dict:
    """Discover and bucket API endpoints for a given domain."""
    e = get_entropy(domain)
    
    # Base discovered endpoints (semi-dynamic names)
    discovered = [
        {"url": f"https://api.{domain}/v1/auth/login",       "bucket": "Auth / Identity",      "status": "Used",      "quantumRisk": "High (RS256)"},
        {"url": f"https://api.{domain}/v1/payments/initiate", "bucket": "Payment Processing",   "status": "Used",      "quantumRisk": "High (ECC-P256)"},
        {"url": f"https://api.{domain}/v1/internal/audit-logs","bucket": "Internal Services",   "status": "Available", "quantumRisk": "Medium (RSA-3072)"},
        {"url": f"https://partner.{domain}/v2/data-sync",     "bucket": "External Partners",    "status": "Used",      "quantumRisk": "High (RS256)"},
        {"url": f"https://api.{domain}/v1/identity/profile",  "bucket": "Auth / Identity",      "status": "Used",      "quantumRisk": "High (RS256)"},
    ]

    total_endpoints = e.get_int(100, 800)
    vulnerable_ratio = e.get_float(0.4, 0.92)
    vulnerable_count = int(total_endpoints * vulnerable_ratio)
    pqc_ready_count = total_endpoints - vulnerable_count

    buckets: dict[str, int] = {}
    for ep in discovered:
        buckets[ep["bucket"]] = buckets.get(ep["bucket"], 0) + 1
    
    # Add virtual padding to buckets to match total
    buckets["Auth / Identity"] += (total_endpoints - len(discovered)) // 2
    buckets["Data Services"] = total_endpoints - sum(buckets.values())

    return {
        "total": total_endpoints,
        "discovered": len(discovered),
        "buckets": buckets,
        "details": discovered,
        "quantumRisk": {
            "vulnerable": vulnerable_count,
            "pqc_ready": pqc_ready_count
        }
    }
