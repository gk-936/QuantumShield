import sys
import os

# Add backend directory to path
sys.path.append(r"c:\Users\gokul D\pnb\backend")

from services.discovery_service import discover_pnb_assets

def test_discovery():
    print("Testing subdomain discovery for pnb.bank.in...")
    results = discover_pnb_assets("pnb.bank.in")
    print(f"Base Domain: {results.get('base_domain')}")
    print(f"Total Found: {results.get('total_found')}")
    for asset in results.get('assets', []):
        print(f" - {asset['host']} | Pillars: {asset['pillars']} | PQC Ready: {asset['pqc_ready']}")

if __name__ == "__main__":
    test_discovery()
