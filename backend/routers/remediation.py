"""
Remediation router — script generation + AI chat (AI is ONLY used here).
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.remediation_service import generate_remediation_scripts
from services.ai_service import ask_remediation_expert

router = APIRouter()


class GenerateRequest(BaseModel):
    findings: list = []


class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []


@router.post("/generate")
def generate(body: GenerateRequest):
    scripts = generate_remediation_scripts(body.findings)
    return {"success": True, "scripts": scripts}


@router.post("/chat")
async def chat(body: ChatRequest):
    response = await ask_remediation_expert(body.message, body.history)
    return {"success": True, "response": response}
