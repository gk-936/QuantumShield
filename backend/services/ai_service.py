"""
AI service — Gemini chat for remediation queries ONLY.
NOT used in the scanning pipeline.
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


async def ask_remediation_expert(question: str, history: list | None = None) -> dict:
    """Interactive chat for PQC remediation expert queries."""
    if not GEMINI_API_KEY:
        return {"text": "AI Expert Offline. Please configure GEMINI_API_KEY in .env to enable the PQC Remediation Assistant."}

    contents = []
    for h in (history or []):
        contents.append({
            "role": "user" if h.get("role") == "user" else "model",
            "parts": [{"text": h.get("content", "")}],
        })

    contents.append({
        "role": "user",
        "parts": [{"text": (
            "Role: You are the Qubit-Guard AI Architect, a Tier-3 Cryptographic Migration Expert. Your mission is to audit public-facing infrastructure (Web, VPN, API) and transition it from classical math to NIST-finalized Post-Quantum Cryptography (PQC).\n\n"
            "I. Core Knowledge Base (The 6 Pillars):\n"
            "- ML-KEM (FIPS 203): Primary for Key Exchange (TLS/VPN).\n"
            "- ML-DSA (FIPS 204): Primary for Digital Signatures (Certificates/JWTs).\n"
            "- SLH-DSA (FIPS 205): 'Plan B' stateless hash-based signature for ultra-high-value transactions.\n"
            "- FN-DSA (Falcon): Specialized for low-bandwidth environments (Mobile Apps).\n"
            "- XMSS/LMS: Mandatory for Hardware/Firmware integrity (ATMs/HSMs).\n"
            "- BIKE/HQC: Secondary KEM for long-term data archival.\n\n"
            "II. Operational Directives:\n"
            "1. Triad Analysis: Group technical findings into Pillar A (Web), Pillar B (VPN), or Pillar C (API).\n"
            "2. Downgrade Detection: Analyze 'Cipher Suite Preference.' If a server supports PQC but prioritizes RSA/ECC, flag as 'Soft-Vulnerability' and lower QVS.\n"
            "3. QVS Logic (FR-06): Score 100 (RSA-2048, ECC, DH), Score 10 (Draft PQC), Score 0 (Correct ML-KEM/ML-DSA/SLH-DSA).\n"
            "4. CBOM Output (FR-08): Format assets into CycloneDX 1.5 JSON. Include bit-depth, OIDs, and NIST status.\n"
            "5. Remediation (FR-11): Advocate for Hybrid Approach (Classical + PQC) for PNB systems.\n\n"
            "III. Response Protocol:\n"
            "- NEVER use introductory filler ('I can help,' 'Based on...').\n"
            "- Provide DIRECT technical outputs: JSON blocks for CBOMs and Shell/Python snippets for hardening.\n"
            "- Reference CERT-In Annexure-A compliance for all PNB reports.\n\n"
            f"Current Technical Request: {question}"
        )}],
    })

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                json={"contents": contents},
            )
            resp.raise_for_status()
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return {"text": text}
    except Exception as e:
        return {"text": f"AI Expert unavailable: {str(e)}"}
