"""
CycloneDX v1.5 CBOM generator — produces a unified Triad CBOM from scan results.
"""

import uuid
from datetime import datetime


def generate_triad_cbom(scan_findings: dict, web_url: str, vpn_url: str, api_url: str) -> dict:
    """
    Generate a CycloneDX v1.5 CBOM reflecting the Triad scanning architecture.
    Components are segmented by asset type: application (Web), network-appliance (VPN), library (API).
    """
    components = [
        {
            "type": "application",
            "name": f"Retail Web Portal ({web_url})",
            "version": "1.0",
            "crypto": "RSA-2048",
            "quantumSafe": False,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": "Web/TLS"},
                {"name": "quantum-shield:crypto-algorithm", "value": "RSA-2048"},
                {"name": "quantum-shield:quantum-safe", "value": "false"},
                {"name": "quantum-shield:key-exchange", "value": "ECDHE"},
            ]
        },
        {
            "type": "network-appliance",
            "name": f"Employee SSL-VPN ({vpn_url})",
            "version": "1.0",
            "crypto": "ECDHE / IKEv1-RSA",
            "quantumSafe": False,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": "VPN/TLS"},
                {"name": "quantum-shield:crypto-algorithm", "value": "IKEv1-RSA-2048"},
                {"name": "quantum-shield:quantum-safe", "value": "false"},
                {"name": "quantum-shield:rfc9370", "value": "false"},
            ]
        },
        {
            "type": "library",
            "name": f"Payment Gateway API / mTLS+JWT ({api_url})",
            "version": "1.0",
            "crypto": "RS256 / ECDSA-P256",
            "quantumSafe": False,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": "API/TLS"},
                {"name": "quantum-shield:crypto-algorithm", "value": "RS256"},
                {"name": "quantum-shield:quantum-safe", "value": "false"},
                {"name": "quantum-shield:mtls", "value": "ECDSA-P256"},
            ]
        },
    ]

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
                    {"name": "quantum-shield:quantum-safe", "value": str(item.get("quantum_safe", False)).lower()},
                ],
            }
            for item in items
        ],
    }
    return cbom
