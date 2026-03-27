# QuantumShield.AI — Product Features & Overview

**QuantumShield.AI** is a comprehensive, enterprise-grade cybersecurity platform designed specifically for the Post-Quantum Cryptography (PQC) migration era. It provides Punjab National Bank (PNB) and other financial institutions with a unified "Triad" approach to identifying and remediating quantum-vulnerable cryptography.

---

## 🚀 Core Functionalities

### ⚡ 1. Triad Scanning Engine
The heart of the platform, examining three critical attack surfaces simultaneously:
- **Pillar A (Web/TLS)**: Real-time TLS handshake probing on web servers (Nginx, Apache, etc.) to detect legacy RSA/ECC certificates and recommend ML-KEM (Kyber) upgrades.
- **Pillar B (VPN/TLS)**: Analysis of VPN gateway protocols (IKEv2, SSL-VPN) for RFC 9370 multi-key exchange support.
- **Pillar C (API Security)**: Parses JWT tokens and mTLS certificates to identify quantum-forgeable signing algorithms (RS256, ES256).

### 🔍 2. PQC-Aware Asset Discovery (FR-01)
Automated network discovery that goes beyond simple port scans:
- **Pillar Classification**: Auto-buckets targets into Web, VPN, or API pillars.
- **Prereq Probing**: Specifically detects TLS 1.3 support, a prerequisite for modern PQC-hybrid ciphers.

### 📦 3. Unified CycloneDX 1.5 CBOM (FR-08)
Generates a structured **Cryptographic Bill of Materials (CBOM)** to meet CERT-In Annexure-A compliance.
- **Enriched Metadata**: Captures bit-size (e.g., 2048-bit), cipher mode (GCM/CBC), and PQC-safe status.
- **Multi-Format Export**: One-click download in **JSON**, **XML**, or **CSV** formats for integration into existing SIEMs (Splunk, QRadar).

### 📊 4. Quantum Vulnerability Scoring (QVS) (FR-06)
A proprietary 0–100 risk weighting system:
- **Scoring**: RSA (100) → ECC (85) → Hybrid PQC (20) → Full ML-KEM/ML-DSA (0).
- **Purpose**: Helps CISO-level stakeholders prioritize remediation efforts based on actual exposure.

### ☢️ 5. Q-Day HNDL Threat Simulator (FR-11)
An interactive exposure model that visualizes the **Harvest-Now-Decrypt-Later** threat.
- **Exposure Metric**: Calculates "Time To Exposure" (TTE) based on current organization-wide risk scores.
- **Purpose**: Demonstrates the real-world business impact of quantum threats to executive decision-makers.

### 🔧 6. AI-Assisted Auto-Remediation
Powered by **Gemini 2.5 Flash**:
- **Expert Guidance**: Interactive chat focused specifically on NIST standards (ML-KEM/ML-DSA).
- **Copy-Paste Snippets**: Generates deployment-ready code for Nginx hardening, OQS-OpenVPN patches, and Python-based JWT migration.

### 📱 7. Mobile App Presence Scanner
- **Verification**: Identifies official and verified PNB applications in the mobile ecosystem, ensuring users are directed away from unauthorized or "cloned" apps.
- **Remediation**: Direct navigation to remediation steps for unauthorized app distribution.

### 🛡️ 8. Enterprise Role-Based Access (RBAC)
- **Admin**: Full control over scan initiation, user management, and configuration.
- **Checker**: Read-only access to PQC ratings, CBOM reports, and audit logs.

---

## 🛠 Technology Stack
- **Frontend**: React 18, Chart.js, Vanilla CSS (Premium/Dynamic UI).
- **Backend**: Python 3.12 (FastAPI), Node.js (Crypto Logic).
- **AI**: Google Generative AI (Gemini 2.5 Flash).
- **Database**: SQLite (Prototype Engine) with SQLAlchemy ORM.
- **Standards**: NIST FIPS 203, FIPS 204, CycloneDX 1.5.

---
**QuantumShield.AI** transforms abstract quantum risks into actionable cryptographic transitions.
