"""
AI service — Gemini chat for remediation queries ONLY.
NOT used in the scanning pipeline.
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


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
        "parts": [{"text": f"You are a PQC (Post-Quantum Cryptography) expert at Punjab National Bank (PNB). Answer this question based on NIST standards (ML-KEM, ML-DSA): {question}"}],
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
