import uuid
from datetime import datetime


def generate_triad_cbom(scan_findings: dict, web_url: str, vpn_url: str, api_url: str, discovered_assets: list = None, discovered_endpoints: list = None, discovered_mobile_apps: list = None) -> dict:
    """
    Generate a dynamic CycloneDX v1.5 CBOM from real scan findings.
    """
    components = []
    # Only use real components from scan findings

    pillar_map = {
        "web": {"type": "application", "name": f"Web Portal ({web_url})", "asset": "Web/TLS"},
        "vpn": {"type": "network-appliance", "name": f"VPN Gateway ({vpn_url})", "asset": "VPN/TLS"},
        "api": {"type": "library", "name": f"Financial API ({api_url})", "asset": "API/TLS"},
        "firmware": {"type": "firmware", "name": "System Firmware", "asset": "System/Firmware"},
        "archival": {"type": "data", "name": "Banking Archives", "asset": "Archival/Storage"},
    }

    for pillar, findings in scan_findings.items():
        if pillar not in pillar_map:
            continue
            
        cfg = pillar_map[pillar]
        # Determine if quantum safe: check for critical/high issues
        has_vulnerabilities = any(f["severity"] in ["critical", "high"] for f in findings)
        
        # Try to extract the detected algorithm from findings
        detected_algo = "Classical (RSA/ECC)"
        for f in findings:
            if "Algorithm" in f["issue"] or "Key Exchange" in f["issue"]:
                detected_algo = f["issue"].split(":")[-1].strip()
                break

        # A target is NOT quantum safe if vulnerabilities were found OR if it resolved to classical cryptography
        is_quantum_safe = not has_vulnerabilities
        if any(classic_kw in detected_algo for classic_kw in ["Classical", "RSA", "ECC", "ECDHE", "ECDSA"]):
            is_quantum_safe = False

        components.append({
            "type": cfg["type"],
            "name": cfg["name"],
            "version": "1.0",
            "crypto": detected_algo,
            "quantumSafe": is_quantum_safe,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": cfg["asset"]},
                {"name": "quantum-shield:crypto-algorithm", "value": detected_algo},
                {"name": "quantum-shield:quantum-safe", "value": str(is_quantum_safe).lower()},
                {"name": "quantum-shield:detected-at", "value": datetime.utcnow().isoformat()},
            ]
        })
    
    # --- Organic Asset Discovery Ingestion ---
    if discovered_assets:
        for asset in discovered_assets:
            host = asset.get("host", "Unknown Host")
            if any(c["name"] == f"Web Portal ({host})" or host in c["name"] for c in components):
                continue  # Avoid duplicates with main pillars

            pqc_ready = asset.get("pqc_ready", False)
            tls_v = asset.get("details", {}).get("tls_version", "TLSv1.2")
            
            # Use deterministic naming and types
            pillar_types = asset.get("pillars", ["Web/TLS"])
            main_pillar = pillar_types[0]
            comp_type = "application" if "Web" in main_pillar else "network-appliance" if "VPN" in main_pillar else "library"
            
            components.append({
                "type": comp_type,
                "name": f"{main_pillar} ({host})",
                "version": asset.get("details", {}).get("version", "1.0"),
                "crypto": "ML-DSA (PQC)" if pqc_ready else f"Classical ({tls_v})",
                "quantumSafe": pqc_ready,
                "properties": [
                    {"name": "quantum-shield:asset-type", "value": main_pillar},
                    {"name": "quantum-shield:discovery-source", "value": "Automated Reconn"},
                    {"name": "quantum-shield:quantum-safe", "value": str(pqc_ready).lower()},
                ]
            })
    
    # --- Deep API Endpoint Ingestion ---
    if discovered_endpoints:
        from urllib.parse import urlparse
        for ep in discovered_endpoints:
            url = ep.get("url", "Unknown Endpoint")
            parsed = urlparse(url)
            endpoint_path = parsed.path or "/"
            host = parsed.hostname
            bucket = ep.get("bucket", "General API")
            risk = ep.get("quantumRisk", "Classical")
            
            # Map every unique active/protected path as a distinct manageable asset
            components.append({
                "type": "library",
                "name": f"API Endpoint: {bucket} ({endpoint_path})",
                "version": "v1",
                "crypto": risk,
                "quantumSafe": "PQC" in risk,
                "properties": [
                    {"name": "quantum-shield:asset-type", "value": f"API/{bucket}"},
                    {"name": "quantum-shield:endpoint-url", "value": url},
                    {"name": "quantum-shield:host", "value": host},
                    {"name": "quantum-shield:http-status", "value": str(ep.get("status_code", 0))},
                    {"name": "quantum-shield:quantum-safe", "value": str("PQC" in risk).lower()},
                ]
            })

    # --- Mobile Application Ingestion ---
    if discovered_mobile_apps:
        for app in discovered_mobile_apps:
            # Map discovered mobile apps as distinct manageable assets
            components.append({
                "type": "application",
                "name": f"Mobile App: {app['name']} ({app['platform']})",
                "version": "v1.0",
                "crypto": "Classical (RSA/ECC)", # Mobile apps in prototype default to classical for audit contrast
                "quantumSafe": False,
                "properties": [
                    {"name": "quantum-shield:asset-type", "value": f"Mobile/{app['platform']}"},
                    {"name": "quantum-shield:package-id", "value": app["id"]},
                    {"name": "quantum-shield:status", "value": app["status"]},
                    {"name": "quantum-shield:quantum-safe", "value": "false"},
                ]
            })

    cbom = {
        "bomFormat": "CycloneDX",
        "specVersion": "1.5",
        "serialNumber": f"urn:uuid:{uuid.uuid4()}",
        "version": 1,
        "metadata": {
            "timestamp": datetime.utcnow().isoformat(),
            "tools": [
                {
                    "vendor": "QuantumShield.AI",
                    "name": "Triad Scanner Engine",
                    "version": "2.0.0",
                }
            ],
            "authors": [
                {
                    "name": "QuantumShield Auditor",
                    "email": "auditor@pnb.bank.in",
                }
            ],
        },
        "components": components,
    }

    return cbom


def generate_cyclonedx(items: list) -> dict:
    """
    Legacy CBOM generator for existing CBOM items (from /api/data/cbom/download).
    """
    cbom = {
        "bomFormat": "CycloneDX",
        "specVersion": "1.5",
        "serialNumber": f"urn:uuid:{uuid.uuid4()}",
        "version": 1,
        "metadata": {
            "timestamp": datetime.utcnow().isoformat(),
            "tools": [{"vendor": "QuantumShield.AI", "name": "Triad Engine", "version": "2.0.0"}],
            "authors": [{"name": "QuantumShield Auditor", "email": "auditor@pnb.bank.in"}],
        },
        "components": [
            {
                "type": "library",
                "name": item.get("component", ""),
                "version": item.get("version", ""),
                "purl": item.get("purl", ""),
                "properties": [
                    {"name": "quantum-shield:crypto-algorithm", "value": item.get("algorithm", "")},
                    {"name": "quantum-shield:key-size", "value": item.get("key_size", "")},
                    {"name": "quantum-shield:mode", "value": item.get("mode", "")},
                    {"name": "quantum-shield:quantum-safe", "value": str(item.get("quantum_safe", False)).lower()},
                ],
            }
            for item in items
        ],
    }
    return cbom
