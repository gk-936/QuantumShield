"""
Data router — dashboard, inventory, cbom queries from SQLite.
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db import get_db
from models import DashboardSummary, InventoryStat, PostureStat, CbomVulnerabilitySummary, CbomItem
from services.cbom_generator import generate_cyclonedx

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


@router.get("/cbom/download")
def download_cbom(db: Session = Depends(get_db)):
    items = db.query(CbomItem).all()
    item_dicts = [
        {
            "component": i.component,
            "version": i.version,
            "algorithm": i.algorithm,
            "quantum_safe": i.quantum_safe,
            "purl": i.purl,
        }
        for i in items
    ]
    cbom = generate_cyclonedx(item_dicts)
    return JSONResponse(
        content=cbom,
        headers={"Content-Disposition": "attachment; filename=quantumshield_cbom.json"},
    )
