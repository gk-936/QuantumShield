"""
SMTP email report service.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime


def send_scan_report(email: str, scan_data: dict) -> bool:
    """Send a PQC scan report via email. Falls back to console logging if SMTP is not configured."""
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    summary = scan_data.get("riskScores", {}).get("overall", "N/A")

    if not smtp_user or not smtp_pass:
        print(f"[MAIL] SMTP credentials missing. Logging report to console instead.")
        print(f"[MAIL-SIM] To: {email}")
        print(f"[MAIL-SIM] Subject: PQC Scan Report")
        print(f"[MAIL-SIM] Overall QVS: {summary}")
        return True

    msg = MIMEMultipart("alternative")
    msg["From"] = '"QuantumShield.AI" <noreply@quantumshield.ai>'
    msg["To"] = email
    msg["Subject"] = f"🛡️ PNB Quantum-Ready Scan Report — {datetime.utcnow().strftime('%Y-%m-%d')}"

    html = f"""
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #C0272D;">QuantumShield.AI — Scan Report</h2>
        <p>Hello Admin, your scheduled PQC scan is complete.</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <h3>Overall Quantum Vulnerability Score: {summary}/100</h3>
        </div>
        <p>Please log in to the <b>QuantumShield.AI Dashboard</b> to view detailed remediation scripts.</p>
        <hr/>
        <p style="font-size: 11px; color: #777;">Punjab National Bank Post-Quantum Readiness Initiative 2026.</p>
    </div>
    """
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(msg["From"], [email], msg.as_string())
        print(f"[MAIL] Report sent to {email}")
        return True
    except Exception as e:
        print(f"[MAIL] Failed to send email: {e}")
        return False
