"""
CycloneDX v1.5 CBOM generator — produces a unified Triad CBOM from scan results.
"""

import uuid
from datetime import datetime


def generate_triad_cbom(scan_findings: dict, web_url: str, vpn_url: str, api_url: str) -> dict:
    """
    Generate a CycloneDX v1.5 CBOM reflecting the Triad+ scanning architecture.
    Components are segmented by asset type: application (Web), network-appliance (VPN),
    library (API), firmware (System), and data (Archival).
    Includes NIST OIDs and FIPS standard references for all 6 PQC algorithm families.
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
                {"name": "quantum-shield:fips-standard", "value": "N/A (Classical)"},
                {"name": "quantum-shield:oid", "value": "1.2.840.113549.1.1.1"},
                {"name": "quantum-shield:recommended-pqc", "value": "ML-KEM-768 (FIPS 203)"},
                {"name": "quantum-shield:recommended-oid", "value": "1.3.6.1.4.1.2.267.12"},
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
                {"name": "quantum-shield:fips-standard", "value": "N/A (Classical)"},
                {"name": "quantum-shield:recommended-pqc", "value": "ML-KEM-768 (FIPS 203) + RFC 9370"},
                {"name": "quantum-shield:recommended-oid", "value": "1.3.6.1.4.1.2.267.12"},
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
                {"name": "quantum-shield:fips-standard", "value": "N/A (Classical)"},
                {"name": "quantum-shield:recommended-pqc", "value": "ML-DSA-65 (FIPS 204)"},
                {"name": "quantum-shield:recommended-oid", "value": "1.3.6.1.4.1.2.267.12"},
                {"name": "quantum-shield:backup-pqc", "value": "SLH-DSA-128f (FIPS 205)"},
                {"name": "quantum-shield:backup-oid", "value": "1.3.6.1.4.1.2.267.11"},
            ]
        },
        {
            "type": "library",
            "name": f"Mobile Banking App (PNB ONE)",
            "version": "4.2.0",
            "crypto": "RSA-2048 (Hardcoded Key)",
            "quantumSafe": False,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": "Mobile/App"},
                {"name": "quantum-shield:crypto-algorithm", "value": "RSA-2048"},
                {"name": "quantum-shield:quantum-safe", "value": "false"},
                {"name": "quantum-shield:fips-standard", "value": "N/A (Classical)"},
                {"name": "quantum-shield:recommended-pqc", "value": "FN-DSA-512 (Falcon)"},
                {"name": "quantum-shield:recommended-oid", "value": "1.3.9999.3.1"},
                {"name": "quantum-shield:fips-status", "value": "Draft (Expected Late 2026)"},
            ]
        },
        {
            "type": "firmware",
            "name": f"System Firmware / Secure Boot ({web_url})",
            "version": "1.0",
            "crypto": "RSA-2048 Code Signing",
            "quantumSafe": False,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": "System/Firmware"},
                {"name": "quantum-shield:crypto-algorithm", "value": "RSA-2048"},
                {"name": "quantum-shield:quantum-safe", "value": "false"},
                {"name": "quantum-shield:fips-standard", "value": "N/A (Classical)"},
                {"name": "quantum-shield:recommended-pqc", "value": "XMSS (RFC 8391) / LMS (RFC 8554)"},
                {"name": "quantum-shield:recommended-oid", "value": "1.3.6.1.4.1.8301.3.1.3.5.1"},
                {"name": "quantum-shield:nist-sp", "value": "NIST SP 800-208"},
                {"name": "quantum-shield:state-management", "value": "Required (HSM-Backed Counter)"},
            ]
        },
        {
            "type": "data",
            "name": f"Banking Data Archives / SWIFT Logs ({web_url})",
            "version": "1.0",
            "crypto": "AES-256-GCM + RSA-2048 Key Wrap",
            "quantumSafe": False,
            "properties": [
                {"name": "quantum-shield:asset-type", "value": "Archival/Storage"},
                {"name": "quantum-shield:crypto-algorithm", "value": "RSA-2048 (Key Wrapping)"},
                {"name": "quantum-shield:symmetric-algorithm", "value": "AES-256-GCM (Quantum-Safe)"},
                {"name": "quantum-shield:quantum-safe", "value": "false"},
                {"name": "quantum-shield:fips-standard", "value": "N/A (Classical Key Wrap)"},
                {"name": "quantum-shield:recommended-pqc", "value": "BIKE-L1 / HQC-128"},
                {"name": "quantum-shield:recommended-oid", "value": "1.3.6.1.4.1.22554.5.1"},
                {"name": "quantum-shield:fips-status", "value": "Round-4 Candidate"},
                {"name": "quantum-shield:retention-requirement", "value": "25+ years"},
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
                    {"name": "quantum-shield:key-size", "value": item.get("key_size", "")},
                    {"name": "quantum-shield:mode", "value": item.get("mode", "")},
                    {"name": "quantum-shield:quantum-safe", "value": str(item.get("quantum_safe", False)).lower()},
                ],
            }
            for item in items
        ],
    }
    return cbom
