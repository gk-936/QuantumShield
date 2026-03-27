"""
QuantumShield.AI — FastAPI Backend Entry Point
"""

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from db import engine, Base
from seed_data import seed
from routers import auth, scan, data, remediation, mobile, discovery, scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables & seed
    Base.metadata.create_all(bind=engine)
    seed()
    print("""
    🚀 QuantumShield.AI Backend is up!
    📡 Framework: FastAPI + Uvicorn
    🛡️  PQC Scanning Engine: ONLINE (Deterministic)
    🗄️  Storage: SQLite via SQLAlchemy
    """)
    yield
    # Shutdown
    print("[SERVER] Shutting down.")


app = FastAPI(
    title="QuantumShield.AI",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    from datetime import datetime
    return {
        "status": "QuantumShield AI Backend v2.0 Active",
        "pqc_engine": "Ready (Deterministic)",
        "storage": "SQLite",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ── Mount Routers ─────────────────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api/auth",        tags=["Auth"])
app.include_router(scan.router,        prefix="/api/scan",        tags=["Scan"])
app.include_router(data.router,        prefix="/api/data",        tags=["Data"])
app.include_router(remediation.router, prefix="/api/remediation", tags=["Remediation"])
app.include_router(discovery.router, prefix="/api/discovery", tags=["discovery"])
app.include_router(mobile.router,      prefix="/api/mobile",      tags=["Mobile"])
app.include_router(scheduler.router,   prefix="/api/scheduler",   tags=["Scheduler"])


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
