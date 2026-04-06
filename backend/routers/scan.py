"""
Triad Scan router — deterministic scanning, NO AI in the pipeline.
"""

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from db import get_db
from models import ScanResult
from services.scanner_engine import perform_triad_scan
from services.api_scanner import discover_endpoints
from services.cbom_generator import generate_triad_cbom
from services.remediation_service import generate_triad_remediation
from services.audit_service import log_audit_event

router = APIRouter()


@router.get("/history")
def get_scan_history(db: Session = Depends(get_db)):
    scans = db.query(ScanResult).order_by(ScanResult.timestamp.desc()).all()
    data = [
        {
            "id": s.scan_id,
            "timestamp": s.timestamp.isoformat(),
            "target": s.web_url,
            "qvs": s.overall_qvs,
        }
        for s in scans
    ]
    return {"success": True, "data": data}


@router.get("/{scan_id}")
def get_scan_detail(scan_id: str, db: Session = Depends(get_db)):
    from fastapi.responses import JSONResponse
    scan = db.query(ScanResult).filter(ScanResult.scan_id == scan_id).first()
    if not scan:
        return JSONResponse(status_code=404, content={"success": False, "message": "Scan not found"})
    
    return {
        "success": True,
        "data": {
            "id": scan.scan_id,
            "timestamp": scan.timestamp.isoformat(),
            "findings": json.loads(scan.findings_json),
            "riskScores": json.loads(scan.risk_scores_json),
            "cbom": json.loads(scan.cbom_json),
            "apiMetrics": json.loads(scan.api_metrics_json or '{}'),
            "webUrl": scan.web_url,
            "vpnUrl": scan.vpn_url,
            "apiUrl": scan.api_url,
        }
    }


class TriadScanRequest(BaseModel):
    webUrl: str = "www.pnb.bank.in"
    vpnUrl: str = "vpn.pnb.bank.in"
    apiUrl: str = "api.pnb.bank.in"
    jwtToken: Optional[str] = ""


@router.post("/triad")
def triad_scan(body: TriadScanRequest, db: Session = Depends(get_db)):
    log_audit_event({"action": "START_TRIAD_SCAN", "target": body.webUrl, "user": "hackathon_user"})

    # 1. Deterministic Triad Scan (no AI)
    scan_results = perform_triad_scan(body.webUrl, body.vpnUrl, body.apiUrl, body.jwtToken or "")

    # 2. API Endpoint Discovery & Bucketing
    api_metrics = discover_endpoints(body.apiUrl or body.webUrl)

    # 3. Unified CBOM Generation
    cbom = generate_triad_cbom(scan_results["findings"], body.webUrl, body.vpnUrl, body.apiUrl)

    # 4. Triad-Specific Remediation
    remediation = generate_triad_remediation()

    # 5. Persist scan result to SQLite
    scan_record = ScanResult(
        scan_id=scan_results["id"],
        web_url=body.webUrl,
        vpn_url=body.vpnUrl,
        api_url=body.apiUrl,
        findings_json=json.dumps(scan_results["findings"]),
        risk_scores_json=json.dumps(scan_results["riskScores"]),
        cbom_json=json.dumps(cbom),
        api_metrics_json=json.dumps(api_metrics),
        overall_qvs=scan_results["riskScores"]["overall"],
    )
    db.add(scan_record)
    db.commit()

    log_audit_event({"action": "COMPLETE_TRIAD_SCAN", "scan_id": scan_results["id"], "qvs": scan_results["riskScores"]["overall"]})

    return {
        "success": True,
        "data": {
            **scan_results,
            "apiMetrics": api_metrics,
            "cbom": cbom,
            "remediation": remediation,
        },
    }
