# Qubit-Guard Prototype — Feature & Functionality Catalog

This document lists every module, menu, and functional component identified during the full system audit of the Qubit-Guard prototype.

---

## 🛠️ Core Infrastructure Features

### 1. Multi-Pillar Scanning Engine (Triad Scanner)
- **Pillar A (Web/TLS)**: Real-time TLS handshake probing, certificate common name extraction, and cipher suite analysis.
- **Pillar B (VPN/TLS)**: IKEv2 port detection (500/4500) and VPN vendor heuristic fingerprinting.
- **Pillar C (API/JWT)**: JWT header parsing for PQC-compliant OIDs (ML-DSA) and mTLS enforcement detection.
- **Pillar D (Firmware)**: Inferred integrity assessments based on organizational PKI patterns.
- **Pillar E (Archival)**: Evaluation of key encapsulation (KEM) risk for long-term storage data.

### 2. Intelligent Asset Discovery
- **Heuristic Subdomain Crawling**: Automated discovery of `api.*`, `vpn.*`, and `www.*` domains.
- **Interactive Graphing**: Nodes-and-edges visualization of the target domain infrastructure.
- **OSINT Harvesting**: Certificate Transparency (CT) log integration for finding shadow assets.

### 3. AI-Powered Remediation (Sarvam AI)
- **Sarvam AI (105B) Chatbot**: Context-aware security expert trained on PQC migration patterns.
- **Playbook Generation**: Instant generation of BASH, Python, and Nginx remediation scripts.
- **Regenerate Fixes**: Capability to re-roll AI suggestions based on updated scan data.

---

## 📊 Analytics & Reporting

### 4. Quantum Vulnerability Scoring (QVS)
- **Grading Scale**: 0-100 risk scoring (RSA-2048 = Critical 100).
- **Temporal Tracking**: History charts showing risk fluctuations over time.

### 5. CBOM Export (CycloneDX 1.5)
- **JSON Export**: One-click download of the Cryptographic Bill of Materials for CERT-In compliance.
- **Component Inventory**: Granular listing of libraries (OpenSSL, liboqs), versions, and associated algorithms.

### 6. PQC Posture & Smart Selector
- **Migration Roadmap**: Visual 2024–2026 alignment with DST and NIST timelines.
- **ML Algorithm Selector**: Intelligent recommendation engine utilizing bandwidth, latency, and device-tier constraints to suggest ML-KEM, ML-DSA, or FN-DSA.

---

## 🏛️ Navigation & UI Elements (The "Menu Audit")

### Sidebar Navigation
- **Navigation Links**: Dashboard, Inventory, Discovery, CBOM, Posture, Rating, Reporting, History, Scanner, Mobile, Remediation, Q-Day, PQC Selector.
- **Audit Button**: "Audit New Bank" primary action trigger.

### Header Actions
- **User Profile**: Access to session settings.
- **Logout**: Secure session termination.
- **Status Indicators**: Backend connectivity and PQC Engine status.

---

## 🛡️ Emerging Threat Simulation

### 7. Q-Day Simulator
- **TTE (Time to Exposure)**: Calculations based on Harvest-Now-Decrypt-Later (HNDL) concepts.
- **Interactive Sliders**: User-adjustable parameters for data sensitivity and quantum computer development speed.

### 8. OWASP Audit (2025)
- **Risk Mapping**: Direct comparison of raw Triad findings against OWASP A02:2025 (Cryptographic Failures).

---
**Document Status**: COMPLETED
**Verification**: ALL buttons verified functional.
