"""
Mobile application scanner service.
Real store metadata + TLS probing of app backend APIs.
"""

import json
import re
import ssl
import socket
import urllib.request
from datetime import datetime


def search_mobile_apps(query: str = "") -> list:
    """Search for mobile applications and return Official and Verified apps matching the query."""
    # Mock database of banking apps for the prototype — in production this would call Play Store/App Store APIs
    all_apps = [
        {"id": "com.pnb.pnbone",       "name": "PNB ONE",                "platform": "Android", "status": "Official", "rating": 4.2},
        {"id": "com.pnb.mpassbook",    "name": "PNB mPassbook",         "platform": "Android", "status": "Official", "rating": 3.9},
        {"id": "com.pnb.corp",         "name": "PNB Corporate Transfer", "platform": "Android", "status": "Official", "rating": 3.5},
        {"id": "com.pnb.auth",         "name": "PNB Authenticator",      "platform": "Android", "status": "Verified", "rating": 4.7},
        {"id": "id123456789",          "name": "PNB ONE",                "platform": "iOS",     "status": "Official", "rating": 4.5},
        
        {"id": "com.sbi.banking",      "name": "SBI YONO",               "platform": "Android", "status": "Official", "rating": 4.4},
        {"id": "com.sbi.mpassbook",    "name": "SBI Anywhere",           "platform": "Android", "status": "Verified", "rating": 4.1},
        
        {"id": "com.hdfc.mobile",      "name": "HDFC Bank MobileBanking","platform": "Android", "status": "Official", "rating": 4.6},
        {"id": "com.hdfc.payzapp",     "name": "PayZapp HDFC",           "platform": "Android", "status": "Verified", "rating": 4.3},

        {"id": "com.icici.imobile",    "name": "iMobile Pay by ICICI",   "platform": "Android", "status": "Official", "rating": 4.5},
        
        {"id": "com.fake.universal",   "name": "Quick Rewards",          "platform": "Android", "status": "Unverified", "rating": 2.1},
    ]

    query_lower = query.lower()
    # If query is very short or generic, results might be broad. 
    # For the prototype, we filter by the provided query string (usually the bank name).
    results = [
        app for app in all_apps
        if query_lower in app["name"].lower() or query_lower in app["id"].lower()
    ]
    
    # Prioritize Official and Verified
    return sorted(results, key=lambda x: x["status"] != "Official")


def _fetch_store_metadata(app_id: str, platform: str) -> dict:
    """Fetch real app metadata from store APIs."""
    metadata = {"version": "Unknown", "name": None, "size": "N/A"}

    if platform == "iOS":
        # Apple iTunes Lookup API — public, reliable JSON API
        try:
            url = f"https://itunes.apple.com/lookup?bundleId={app_id}"
            req = urllib.request.Request(url, headers={"User-Agent": "QuantumShield-Scanner/2.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode())
                if data.get("resultCount", 0) > 0:
                    result = data["results"][0]
                    metadata["version"] = result.get("version", "Unknown")
                    metadata["name"] = result.get("trackName")
                    size_bytes = result.get("fileSizeBytes", 0)
                    if size_bytes:
                        metadata["size"] = f"{int(size_bytes) / (1024*1024):.1f} MB"
        except Exception:
            pass
    else:
        # Android: Try Google Play Store page
        try:
            url = f"https://play.google.com/store/apps/details?id={app_id}&hl=en"
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            })
            with urllib.request.urlopen(req, timeout=5) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                # Try multiple patterns to extract version
                for pattern in [
                    r'\[\[\["(\d+\.\d+[\.\d]*)"',
                    r'softwareVersion["\s:]+["\']?(\d+\.\d+[\.\d]*)',
                    r'Current Version.*?(\d+\.\d+[\.\d]*)',
                ]:
                    ver_match = re.search(pattern, html)
                    if ver_match:
                        metadata["version"] = ver_match.group(1)
                        break
        except Exception:
            pass

    return metadata


def _probe_app_api_tls(app_id: str) -> dict:
    """Probe the app's likely API domain for TLS posture."""
    parts = app_id.split(".")
    api_domain = None

    if len(parts) >= 2 and parts[0] in ["com", "in", "org", "net"]:
        org = parts[1]  # e.g., "pnb"
        candidates = [
            f"api.{org}.com", f"www.{org}.com", f"{org}.com",
            f"api.{org}.co.in", f"www.{org}.co.in", f"{org}.co.in",
        ]
        for candidate in candidates:
            try:
                socket.gethostbyname(candidate)
                api_domain = candidate
                break
            except socket.gaierror:
                continue

    if not api_domain:
        return {"reachable": False}

    try:
        context = ssl.create_default_context()
        with socket.create_connection((api_domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=api_domain) as tls_sock:
                cipher = tls_sock.cipher()
                tls_version = tls_sock.version()
                return {
                    "reachable": True,
                    "domain": api_domain,
                    "cipher_name": cipher[0] if cipher else "Unknown",
                    "cipher_bits": cipher[2] if cipher else 0,
                    "tls_version": tls_version,
                }
    except Exception:
        return {"reachable": False, "domain": api_domain}


def scan_mobile_app(app_id: str, platform: str) -> dict:
    """
    Mobile app analysis combining real store metadata and TLS probing.
    """
    # 1. Fetch real store metadata
    store_meta = _fetch_store_metadata(app_id, platform)

    results = {
        "appId": app_id,
        "platform": platform,
        "version": store_meta["version"],
        "packageSize": store_meta["size"],
        "timestamp": datetime.utcnow().isoformat(),
        "findings": [],
        "pqc_score": 0,
    }

    # 2. Probe the app's API domain for TLS posture
    api_tls = _probe_app_api_tls(app_id)

    if api_tls.get("reachable"):
        cipher_name = api_tls["cipher_name"]
        tls_version = api_tls["tls_version"]

        pqc_detected = any(m in cipher_name.upper() for m in ["KYBER", "MLKEM", "ML-KEM", "DILITHIUM", "ML-DSA"])

        if pqc_detected:
            results["findings"].append({
                "severity": "info",
                "issue": f"PQC-Ready API Backend: {cipher_name}",
                "detail": f"App's API domain ({api_tls['domain']}) negotiated PQC-hybrid cipher: {cipher_name}.",
                "recommendation": None,
            })
            results["pqc_score"] = 0
            results["quantumSafe"] = True
        else:
            is_rsa = "RSA" in cipher_name and "ECDHE" not in cipher_name
            results["findings"].append({
                "severity": "critical" if is_rsa else "high",
                "issue": f"Classical Crypto on App Backend: {cipher_name}",
                "detail": f"App's API domain ({api_tls['domain']}) uses {cipher_name} ({api_tls['cipher_bits']}-bit, {tls_version}). No PQC algorithms detected.",
                "recommendation": "Integrate liboqs or Bouncy Castle PQC providers. Enable hybrid X25519MLKEM768 on the API gateway.",
            })
            results["pqc_score"] = 100 if is_rsa else 85
            results["quantumSafe"] = False

            if tls_version and tls_version < "TLSv1.3":
                results["findings"].append({
                    "severity": "high",
                    "issue": f"Legacy TLS on App Backend: {tls_version}",
                    "detail": f"API domain {api_tls['domain']} uses {tls_version}. TLS 1.3 is required for PQC cipher suites.",
                    "recommendation": "Upgrade API gateway to TLS 1.3.",
                })
    else:
        domain_str = api_tls.get("domain", "not resolved")
        results["findings"].append({
            "severity": "high",
            "issue": "App Backend API Unreachable",
            "detail": f"Could not probe the app's API backend ({domain_str}). PQC posture could not be verified. Classical RSA/ECC is likely based on standard mobile banking profiles.",
            "recommendation": "Integrate liboqs or Bouncy Castle PQC providers into the mobile build pipeline.",
        })
        results["pqc_score"] = 100
        results["quantumSafe"] = False

    # 3. Store metadata finding
    if store_meta["version"] != "Unknown":
        results["findings"].append({
            "severity": "info",
            "issue": f"App Version Verified: {store_meta['version']}",
            "detail": f"Version {store_meta['version']} from {'App Store' if platform == 'iOS' else 'Play Store'}. Size: {store_meta['size']}.",
            "recommendation": None,
        })

    return results
