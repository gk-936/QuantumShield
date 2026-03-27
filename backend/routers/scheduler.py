"""
Scheduler router — create and list automated scan schedules.
"""

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db import get_db
from models import Schedule

router = APIRouter()


class ScheduleCreateRequest(BaseModel):
    frequency: str = "daily"
    targets: dict = {}


@router.post("/create")
def create_schedule(body: ScheduleCreateRequest, db: Session = Depends(get_db)):
    schedule = Schedule(
        frequency=body.frequency,
        targets_json=json.dumps(body.targets),
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return {"success": True, "schedule": {"id": schedule.id, "frequency": body.frequency, "targets": body.targets}}


@router.get("/list")
def list_schedules(db: Session = Depends(get_db)):
    schedules = db.query(Schedule).all()
    return [
        {"id": s.id, "frequency": s.frequency, "targets": json.loads(s.targets_json)}
        for s in schedules
    ]
