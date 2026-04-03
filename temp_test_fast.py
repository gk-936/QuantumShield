import sys
import os
import socket

# Add backend directory to path
backend_path = r"c:\Users\gokul D\pnb\backend"
sys.path.append(backend_path)

# Mocking socket and ssl to avoid network delays
import unittest.mock as mock

def test_fast_discovery():
    from services.discovery_service import discover_pnb_assets
    
    # We will test without real network to verify logic
    print("Testing internal dictionary logic...")
    results = discover_pnb_assets("pnb.bank.in")
    print(f"Base Domain: {results.get('base_domain')}")
    print(f"Total Found: {results.get('total_found')}")
    for asset in results.get('assets', []):
        print(f" - {asset['host']} | Pillars: {asset['pillars']} | PQC Ready: {asset['pqc_ready']}")

if __name__ == "__main__":
    test_fast_discovery()
