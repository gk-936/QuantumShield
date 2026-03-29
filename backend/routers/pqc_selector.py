"""
PQC Smart Selector Router — ML-based algorithm selection and audit endpoints.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.pqc_algorithms import get_all_algorithms, generate_audit_table, get_algorithm
from services.ml_selector import select_algorithm

router = APIRouter()


class PQCSelectRequest(BaseModel):
    pillar: str = "Web"
    bandwidth_kbps: int = 50000
    latency_ms: int = 10
    device_type: str = "Server"
    retention_years: int = 1
    compliance: str = "CERT-In"


@router.post("/select")
def pqc_select(body: PQCSelectRequest):
    """
    ML-based PQC algorithm selection.
    Input: scan metadata (pillar, bandwidth, latency, device, retention, compliance).
    Output: recommended algorithm with Selector_Log and confidence score.
    """
    result = select_algorithm(
        pillar=body.pillar,
        bandwidth_kbps=body.bandwidth_kbps,
        latency_ms=body.latency_ms,
        device_type=body.device_type,
        retention_years=body.retention_years,
        compliance=body.compliance,
    )

    # Enrich with algorithm registry data
    algo_info = get_algorithm(result["algorithm"])
    if algo_info:
        result["algorithm_detail"] = {
            "fips_standard": algo_info.get("fips_standard"),
            "oid": algo_info.get("oid"),
            "fips_status": algo_info.get("fips_status"),
            "family": algo_info.get("family"),
            "dst_phase": algo_info.get("dst_roadmap_phase"),
        }

    return {"success": True, "data": result}


@router.get("/algorithms")
def pqc_algorithms():
    """Return the full PQC algorithm registry (all 6 families)."""
    algorithms = get_all_algorithms()
    return {
        "success": True,
        "count": len(algorithms),
        "data": algorithms,
    }


@router.get("/audit")
def pqc_audit():
    """
    Return the 6-row PQC Verification Audit Table.
    Used by the Qubit-Guard Verification Auditor for compliance checks.
    """
    table = generate_audit_table()
    return {
        "success": True,
        "count": len(table),
        "data": table,
        "compliance_reference": "CERT-In Annexure-A / DST PQC Migration Roadmap (March 2026)",
    }


@router.get("/algorithm/{name}")
def pqc_algorithm_detail(name: str):
    """Look up a specific algorithm by name or alias."""
    algo = get_algorithm(name)
    if algo:
        return {"success": True, "data": algo}
    return {"success": False, "message": f"Algorithm '{name}' not found in registry."}
