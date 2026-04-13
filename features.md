# Qubit-Guard — Prototype Features & Overview

**Qubit-Guard** is a comprehensive cybersecurity platform developed for the Post-Quantum Cryptography (PQC) migration era. This functional prototype provides Punjab National Bank (PNB) with a unified approach to identifying and remediating quantum-vulnerable cryptography.

---

## 🚀 Working Prototype Functionalities

### ⚡ 1. Multi-Pillar PQC Scanning Engine
While rooted in a "Triad" approach, the platform's core scanning engine categorizes cryptographic exposure across five key infrastructure pillars:
- **Pillar A (Web/TLS) [LIVE]**: Performs real-time TLS handshake probing via Node.js network sockets to extract live certificate details, issuer info, and RSA/ECC key lengths from target domains.
- **Pillar B (VPN/TLS) [SIMULATED]**: Demonstrates gateway analysis heuristics to identify vulnerable IKEv1/RSA configurations.
- **Pillar C (API Security) [LIVE PARSER]**: Decodes and analyzes user-provided JWT tokens to identify quantum-forgeable signing algorithms (e.g., RS256) versus PQC-safe standards.
- **Pillar D (Firmware Integrity) [MOCK]**: Framework representing stateless hash-based signing analysis (XMSS/LMS) for secure hardware and firmware updates.
- **Pillar E (Archival Encryption) [MOCK]**: Framework representing BIKE/HQC KEM analysis designed to protect long-term archived data against Harvest-Now-Decrypt-Later (HNDL) attacks.

### 🔍 2. PQC-Aware Asset Discovery
- **Heuristic Scraping [LIVE]**: Actively crawls target domains to extract visible URLs, automatically bucketing them into `vpn.*`, `api.*`, or `web.*` infrastructure categories based on subdomain signatures.

### 📦 3. Unified CycloneDX 1.5 CBOM Export
Generates a structured **Cryptographic Bill of Materials (CBOM)** to meet CERT-In compliance.
- **JSON Export [LIVE]**: Dynamically generates and allows immediate download of CycloneDX 1.5 formatted JSON files representing the scanned assets and identified algorithms.

### 📊 4. Quantum Vulnerability Scoring & Q-Day Simulator
- **Risk Scoring [LIVE LOGIC]**: Proprietary grading engine that evaluates scan results, aggressively flagging sub-2048 bit RSA keys as critical (100) and recommending ML-KEM/ML-DSA.
- **HNDL Threat Simulator [UI]**: Visually calculates and demonstrates the "Time To Exposure" (TTE) impact based on Harvest-Now-Decrypt-Later concepts.

### 🤖 5. AI-Assisted Remediation Engine (Gemini 2.5 Flash)
- **Live LLM Integration [LIVE]**: Actively communicates with the Google Gemini 2.5 Flash API to analyze specific, raw Triad scan metrics and generate contextual summaries.
- **Chatbot & Scripting [LIVE]**: Users can interact with a specialized PQC expert persona to generate customized Bash or Terraform remediation playbooks for immediate deployment.

### 📱 6. Universal Mobile App Presence Auditor
- **App Discovery [MOCK]**: Queries the user-provided bank target, generates an inventory of associated mobile applications, and provides a simulated sandbox UI for cryptographic compliance analysis.

### 📅 7. Automated PQC Audit Reporting & Scheduling
- **Task Scheduling [LIVE]**: Uses a reliable CRON engine to schedule automated "Fresh Scans" triggered precisely at user-designated times.
- **Automated Dispatch [LIVE]**: Automatically executes the Triad Scan sequence + AI Analysis in the background and dispatches executive summaries directly via SMTP/Gmail integration.

### 🛡️ 8. Secure Authentication Access
- **JWT & Encryption [LIVE]**: Secures the prototype with standard JWT-based state retention and Bcrypt password hashing to protect the primary dashboard routes.

### 🧠 9. PQC Smart Selector (ML Recommendation Engine)
- **Context-Aware Selection [LIVE]**: Suggests optimal PQC algorithms (e.g., ML-KEM vs. FN-DSA) based on user-defined constraint sliders (bandwidth, latency, and device tier).
- **Compliance Audit Table [LIVE]**: Connects algorithm recommendations directly to the official DST PQC Roadmap 2026 and CERT-In Annexure-A verifications.

### 📋 10. OWASP Top 10 (2025) Audit Engine 
- **Risk Mapping [LIVE]**: Instantly compares raw Triad Scan findings against the projected OWASP 2025 cryptographic failure categories. 
- **Threat Vector Analysis [LIVE]**: Provides detailed attack/prevention strategy cards (e.g., A02:2025 Cryptographic Failures) mapped to relevant NIST standardization guidelines.

### 🗄️ 11. Sovereign Asset Inventory & Scan History
- **Asset Management [LIVE]**: A localized system to filter, manually add, and securely manage cryptographic components (Software, VPNs, APIs) with associated risk ratings.
- **Audit Trails [LIVE]**: Maintains historical logs of all Triad Scans executed, allowing compliance officers to view temporal progress directly from the dashboard.

---

## 🛠 Technology Stack
- **Frontend**: React 18, Chart.js, Vanilla CSS.
- **Backend / Scanning**: Node.js (Express, TLS, Axios).
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash).
- **Database**: Local JSON Persistence for lightweight prototype portability.
- **Standards Applied**: NIST FIPS 203, FIPS 204, CycloneDX 1.5.
