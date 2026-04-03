import sys
import os
from datetime import datetime

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.scanner_engine import _scan_web_tls, _scan_vpn_tls, _scan_api_jwt
from services.cbom_generator import generate_triad_cbom
from services.mobile_scanner import scan_mobile_app

def test_upgraded_features():
    print("--- ⚡ Testing Upgraded Scanner Engine ---")
    
    # 1. Test Web/TLS (Live)
    print("\n[SCENARIO 1] Real TLS Probe on google.com")
    web_res = _scan_web_tls("google.com")
    print(f"Detected Cert: {web_res['findings'][0]['issue']}")
    print(f"QVS Score: {web_res['qvs']}")

    # 2. Test VPN Probe (Live Port Check)
    print("\n[SCENARIO 2] Real VPN Port Probe on vpn.pnbindia.in (Expected fallback to classical)")
    vpn_res = _scan_vpn_tls("vpn.pnbindia.in")
    print(f"Detected Protocol: {vpn_res['findings'][0]['issue']}")
    
    # 3. Test JWT PQC Audit
    print("\n[SCENARIO 3] Deep JWT Audit with NIST PQC OIDs")
    # Fake JWT header with ML-DSA OID
    pqc_jwt = "eyJhbGciOiJNTyIsIm9pZCI6IjIuMTYuODQwLjEuMTAxLjMuNC4zLjE4In0.cGF5bG9hZA.c2lnbmF0dXJl"
    api_res = _scan_api_jwt("api.test.com", pqc_jwt)
    found_pqc = any("PQC-Ready" in f["issue"] for f in api_res["findings"])
    print(f"PQC OID Detected: {found_pqc}")

    print("\n--- 📦 Testing Dynamic CBOM Mapping ---")
    full_findings = {
        "web": web_res["findings"],
        "vpn": vpn_res["findings"],
        "api": api_res["findings"],
        "firmware": [],
        "archival": []
    }
    cbom = generate_triad_cbom(full_findings, "google.com", "vpn.pnb.in", "api.pnb.in")
    web_comp = next(c for c in cbom["components"] if c["type"] == "application")
    print(f"CBOM Dynamic Algorithm for Web: {web_comp['crypto']}")
    print(f"CBOM Quantum Safe Status: {web_comp['quantumSafe']}")

    print("\n--- 📱 Testing Heuristic Mobile Scanner ---")
    print("[SCENARIO 4] Scanning 'com.pnb.quantum_ready_kyber'")
    mob_res = scan_mobile_app("com.pnb.quantum_ready_kyber", "Android")
    print(f"Mobile PQC Detected: {'Marker Detected' in mob_res['findings'][0]['issue']}")

    print("\n✅ Verification Completed Successfully!")

if __name__ == "__main__":
    test_upgraded_features()
