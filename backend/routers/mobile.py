"""
Mobile scanner router.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.mobile_scanner import search_pnb_apps, scan_mobile_app

router = APIRouter()


class MobileScanRequest(BaseModel):
    appId: str
    platform: str = "Android"


@router.get("/search")
def search():
    apps = search_pnb_apps()
    return {"success": True, "apps": apps}


@router.post("/scan")
def scan(body: MobileScanRequest):
    results = scan_mobile_app(body.appId, body.platform)
    return {"success": True, "results": results}
