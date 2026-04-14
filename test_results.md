# Qubit-Guard Prototype — Test Results Report

**Role**: Qubit-Guard Testing Engineer
**Date**: April 14, 2026
**Overall Test Score**: **95/100** 🟢

---

## 1. Multi-Domain Verification Results

The prototype was tested against three live banking domains. All values were cross-referenced with real-time TLS handshake probes and compared against baseline ground truth.

| Domain | Verified Common Name (CN) | TLS Version | Primary Cipher Suite | Assets Discovered | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **pnb.bank.in** | pnb.bank.in | TLSv1.2 | ECDHE-RSA-AES256-GCM-SHA384 | 5 | ✅ SUCCESS |
| **manipurrural.bank.in** | manipurrural.bank.in | TLSv1.3 | TLS_AES_256_GCM_SHA384 | 5 | ✅ SUCCESS |
| **bankofbaroda.in** | bankofbaroda.in | TLSv1.3 | TLS_AES_256_GCM_SHA384 | 3 | ✅ SUCCESS |

### Verification Methodology:
- **Triad Scanner**: Verified that the scanner correctly identifies the TLS version and Cipher name. Results matched manual `openssl` probes.
- **Asset Discovery**: Verified that the discovery engine successfully crawled subdomains and bucketed them into the local graph.
- **Data Accuracy**: All QVS risk scores (e.g., 90 for RSA-2048) correctly reflected the logic defined in `scanner_engine.py`.

---

## 2. Module Functional Audit

Every button and menu item in the prototype was clicked and verified for functional integrity.

| Module | Features Tested | Status |
| :--- | :--- | :--- |
| **Dashboard** | Chart Rendering, Summary Cards, "Audit New Bank" | ✅ Working |
| **Triad Scanner** | Input Probing, Result Extraction, QVS Scoring | ✅ Working |
| **Asset Discovery** | Graph Rendering, Subdomain Probing, Refresh | ✅ Working |
| **Asset Inventory** | Filtering, Manual Addition, Risk Labeling | ✅ Working |
| **CBOM Engine** | CycloneDX 1.5 JSON Generation & Download | ✅ Working |
| **PQC Posture** | Compliance Mapping, Remediate Shortcuts | ✅ Working |
| **Cyber Rating** | Elite-PQC Grading, Rating Breakdown | ✅ Working |
| **Reporting** | Audit Scheduling, Email Dispatch Trigger | ✅ Working |
| **History** | Scan Log Persistence, Context Activation | ✅ Working |
| **Remediation** | **Sarvam AI** Chatbot, Playbook Generation | ✅ Working |
| **Mobile Scanner** | App Discovery, Compliance Sandbox UI | ✅ Working |
| **Q-Day Simulator** | TTE Calculations, Interactive Risk Sliders | ✅ Working |
| **PQC Selector** | ML Recommendation Engine, Constraint Sliders | ✅ Working |
| **OWASP Audit** | 2025 Cryptographic Failure Mapping | ✅ Working |

---

## 3. Sarvam AI Integration Check

> [!NOTE]
> The **Sarvam AI (sarvam-105b)** was used for all remediation queries.

- **Query**: "Generate an Nginx hardening script for pnb.bank.in to support ML-KEM."
- **Response**: The AI generated a detailed BASH script including `ssl_ciphers x25519_kyber768` and `TLSv1.3` enforcement.
- **Context**: The AI successfully acknowledged existing scan findings and prioritized "Hybrid Classical + PQC" approaches.

---

## 4. Assessment & Final Score (95/100)

### Strengths:
- **Real-Time Accuracy**: The TLS probing engine is highly reliable and provides verifiable data.
- **Unified Logic**: The "Golden Thread" from scanning to AI remediation is seamless.
- **UI Aesthetics**: The dark-navy and cyan branding is consistent and professional.

### Areas for Improvement (Reasons for -5 points):
- **Graph Caching**: The Asset Discovery graph occasionally requires a manual refresh to clear nodes from a previous scan context.
- **Field Retention**: Input fields in the Triad Scanner do not clear automatically after a successful scan, which may cause minor UX friction.

---
**Status**: Prototype ready for final stakeholder presentation.
