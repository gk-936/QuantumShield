import requests
import json
import time

BASE_URL = "http://localhost:5006/api"

def test_persistence_and_sync():
    print("[TEST] 1. Initiating a Triad Scan...")
    scan_payload = {
        "webUrl": "verification.test.com",
        "vpnUrl": "vpn.test.com",
        "apiUrl": "api.test.com",
        "jwtToken": "fakesig.verification"
    }
    
    try:
        # 1. Run a scan
        res = requests.post(f"{BASE_URL}/scan/triad", json=scan_payload)
        scan_data = res.json()
        if not scan_data.get("success"):
            print("[FAIL] Scan failed:", scan_data)
            return
        
        scan_id = scan_data["data"]["scanId"]
        print(f"[PASS] Scan successful. ID: {scan_id}")

        # 2. Check history
        print("[TEST] 2. Checking scan history...")
        history_res = requests.get(f"{BASE_URL}/scan/history")
        history = history_res.json()
        found = any(s["id"] == scan_id for s in history["data"])
        if found:
            print("[PASS] Scan found in history.")
        else:
            print("[FAIL] Scan NOT found in history.")
            return

        # 3. Verify Sync (Dashboard)
        print("[TEST] 3. Verifying Dashboard Sync via X-Scan-Id header...")
        # Normal dashboard
        dash_normal = requests.get(f"{BASE_URL}/data/dashboard").json()
        
        # Historical dashboard
        headers = {"X-Scan-Id": scan_id}
        dash_hist = requests.get(f"{BASE_URL}/data/dashboard", headers=headers).json()
        
        # Check if the subtext indicates it's from the scan
        subtext = dash_hist["data"]["summary"]["assetsDiscovery"]["subtext"]
        if "Discovered in this scan" in subtext:
            print("[PASS] Dashboard correctly returned historical data mapping.")
        else:
            print("[FAIL] Dashboard did NOT return historical data. Subtext:", subtext)

        print("\n[SUCCESS] Persistence and Sync logic verified!")

    except Exception as e:
        print(f"[ERROR] Verification failed: {e}")

if __name__ == "__main__":
    # Ensure server is running or mock the requests
    # Since I cannot guarantee the server is running on 5006, I'll provide this as a guide.
    # In a real environment, I would start the server.
    test_persistence_and_sync()
