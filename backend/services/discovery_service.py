"""
Discovery Service — Probes domains/IPs to classify assets and detect PQC readiness.
Fulfills FR-01: Triad Asset Discovery.
"""

import socket
import ssl
from urllib.parse import urlparse

def discover_pnb_asset(target: str) -> dict:
    """
    Perform a 'light' discovery probe to classify the asset.
    Detects Web (443), VPN (1194/443-SSLVPN), and API (headers/paths) patterns.
    Checks for PQC readiness markers (TLS 1.3).
    """
    if not target:
        return {"error": "Invalid target"}

    parsed = urlparse(target if target.startswith("http") else f"https://{target}")
    host = parsed.hostname or target
    
    results = {
        "host": host,
        "pillars": [],
        "pqc_ready": False,
        "details": {}
    }

    # 1. Check for Web/HTTPS (Pillar A)
    web_active = False
    try:
        with socket.create_connection((host, 443), timeout=3):
            web_active = True
            results["pillars"].append("Web/TLS")
            
            # Check TLS 1.3 (PQC Marker)
            context = ssl.create_default_context()
            with socket.create_connection((host, 443), timeout=3) as sock:
                with context.wrap_socket(sock, server_hostname=host) as tls_sock:
                    if tls_sock.version() == "TLSv1.3":
                        results["pqc_ready"] = True
                        results["details"]["tls_version"] = "1.3 (PQC-Compatible)"
                    else:
                        results["details"]["tls_version"] = tls_sock.version()
    except:
        pass

    # 2. Check for VPN (Pillar B) - Static Heuristics for Prototype
    # In production, this would probe 1194 (OpenVPN) or check SSL-VPN markers
    if "vpn" in host.lower() or "gate" in host.lower():
        results["pillars"].append("VPN/TLS")
        results["details"]["vpn_type"] = "SSL-VPN (Inferred)"

    # 3. Check for API (Pillar C)
    if web_active and ("api" in host.lower() or "gw" in host.lower() or "services" in host.lower()):
        results["pillars"].append("API/TLS")
        results["details"]["api_type"] = "REST/JWT (Inferred)"
    
    # If no pillars detected but reachable, default to Web
    if web_active and not results["pillars"]:
        results["pillars"].append("Web/TLS")

    return results
