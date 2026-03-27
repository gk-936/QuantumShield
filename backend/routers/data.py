"""
Data router — dashboard, inventory, cbom queries from SQLite.
"""

import os
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db import get_db
from models import DashboardSummary, InventoryStat, PostureStat, CbomVulnerabilitySummary, CbomItem
from services.cbom_generator import generate_cyclonedx
from services.mail_service import send_scan_report
from pydantic import BaseModel

class EmailRequest(BaseModel):
    email: str
    reportType: str

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    rows = db.query(DashboardSummary).all()
    summary = {r.key: {"value": r.value, "label": r.label, "subtext": r.subtext} for r in rows}

    inv_rows = db.query(InventoryStat).all()
    inventory = {r.category: r.count for r in inv_rows}

    posture_rows = db.query(PostureStat).all()
    posture = {r.metric: r.value for r in posture_rows}

    cbom_rows = db.query(CbomVulnerabilitySummary).all()
    cbom_summary = {r.severity: r.count for r in cbom_rows}

    return {
        "success": True,
        "data": {
            "summary": summary,
            "inventory": inventory,
            "posture": posture,
            "cbomSummary": cbom_summary,
        },
    }


@router.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(CbomItem).all()
    data = [
        {
            "component": i.component,
            "version": i.version,
            "algorithm": i.algorithm,
            "quantumSafe": i.quantum_safe,
            "risk": i.risk,
            "category": i.category,
            "purl": i.purl,
        }
        for i in items
    ]
    return {"success": True, "data": data}


@router.get("/cbom")
def get_cbom(db: Session = Depends(get_db)):
    items = db.query(CbomItem).all()
    cbom_items = [
        {
            "component": i.component,
            "version": i.version,
            "algorithm": i.algorithm,
            "quantumSafe": i.quantum_safe,
            "risk": i.risk,
            "category": i.category,
            "purl": i.purl,
        }
        for i in items
    ]
    return {"success": True, "data": {"cbomItems": cbom_items}}


@router.get("/cbom/export/{fmt}")
def export_cbom(fmt: str, db: Session = Depends(get_db)):
    items = db.query(CbomItem).all()
    item_dicts = [
        {
            "component": i.component,
            "version": i.version,
            "algorithm": i.algorithm,
            "key_size": i.key_size,
            "mode": i.mode,
            "quantum_safe": i.quantum_safe,
            "risk": i.risk,
            "category": i.category,
            "purl": i.purl,
        }
        for i in items
    ]

    if fmt == "csv":
        import io, csv
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=item_dicts[0].keys() if item_dicts else [])
        writer.writeheader()
        writer.writerows(item_dicts)
        return JSONResponse(
            content=output.getvalue(),
            headers={"Content-Disposition": "attachment; filename=cbom.csv", "Content-Type": "text/csv"},
        )
    elif fmt == "xml":
        import xml.etree.ElementTree as ET
        root = ET.Element("bom", {"xmlns": "http://cyclonedx.org/schema/bom/1.5"})
        components = ET.SubElement(root, "components")
        for item in item_dicts:
            c = ET.SubElement(components, "component", {"type": "library"})
            ET.SubElement(c, "name").text = item["component"]
            ET.SubElement(c, "version").text = item["version"]
            # Add crypto properties as per CycloneDX
            props = ET.SubElement(c, "properties")
            ET.SubElement(props, "property", {"name": "crypto:algorithm"}).text = item["algorithm"]
            ET.SubElement(props, "property", {"name": "crypto:quantum-safe"}).text = str(item["quantum_safe"])
        
        import io
        output = io.BytesIO()
        tree = ET.ElementTree(root)
        tree.write(output, encoding='utf-8', xml_declaration=True)
        return JSONResponse(
            content=output.getvalue().decode('utf-8'),
            headers={"Content-Disposition": "attachment; filename=cbom.xml", "Content-Type": "application/xml"},
        )
    
    # Default JSON
    cbom = generate_cyclonedx(item_dicts)
    return JSONResponse(
        content=cbom,
        headers={"Content-Disposition": f"attachment; filename=cbom.{fmt}"},
    )
@router.post("/report/send")
def send_report(req: EmailRequest, db: Session = Depends(get_db)):
    # Fetch some dummy scan results to populate the email
    overall_qvs = 85  # Default or fetched from posture
    findings = {
        "riskScores": {"overall": overall_qvs},
        "reportType": req.reportType
    }
    
    # Check if SMTP is configured
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    is_simulated = not (smtp_user and smtp_pass)
    
    success, error_detail = send_scan_report(req.email, findings)
    
    # If it's a Demo Mode fallback, treat as simulation
    is_demo_fallback = "Demo Mode" in str(error_detail)
    
    if success:
        return {
            "success": True, 
            "message": f"Report sent to {req.email}",
            "simulated": is_simulated or is_demo_fallback
        }
    return {"success": False, "message": f"SMTP Error: {error_detail}"}
