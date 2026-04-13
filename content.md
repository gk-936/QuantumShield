# Qubit-Guard: Platform Presentation Guide

This document outlines the core aspects to be presented to the PNB evaluator for each window of the Qubit-Guard platform. The primary focus is on Post-Quantum Cryptography (PQC), the Triad Scanning engine, the 6 PQC algorithms implemented, and the proprietary ML dataset.

## 📊 Overview of Windows & Important Functionalities

---

### 1. Dashboard (Home)
- **Features**: High-level visual summary of the organization's Quantum Vulnerability Score (QVS), real-time alerts, and executive summary metrics.
- **Important Functionalities**: Aggregates data from all scanners to show the immediate risk posture. The entry point for CISO-level stakeholders to gauge immediate exposure.
- **Focus**: Highlights the transition progress from legacy RSA/ECC to Quantum-Safe algorithms.

### 2. Asset Inventory
- **Features**: Centralized management of all discovered network assets categorized by "Pillars" (Web, VPN, API, Mobile, Firmware, Archival).
- **Important Functionalities**: Displays current cryptographic protocols and cipher suites associated with each asset, flag vulnerable endpoints, and allows manual categorization.

### 3. Asset Discovery
- **Features**: Automated network mapping and asset identification.
- **Important Functionalities**: Goes beyond simple port scanning by actively probing targets for TLS 1.3 support (a critical prerequisite for modern PQC hybrid ciphers). Automatically buckets targets into appropriate pillars.

### 4. CBOM (Cryptographic Bill of Materials)
- **Features**: Detailed ledger of all cryptographic artifacts utilized across the enterprise.
- **Important Functionalities**: Generates a unified CycloneDX 1.5 CBOM. Captures metadata like bit-size (e.g., 2048-bit), cipher mode, and PQC-safe status. Offers multi-format export (JSON, XML, CSV) to satisfy CERT-In Annexure-A compliance.

### 5. Posture of PQC
- **Features**: Granular analytics on cryptographic migration progress.
- **Important Functionalities**: Visualizes the distribution of vulnerable vs. safe algorithms. Tracks organizational compliance against the DST PQC Migration Roadmap.

### 6. Cyber Rating (QVS)
- **Features**: Proprietary risk weighting system (0–100 scale).
- **Important Functionalities**: Quantifies quantum risk: RSA scores a critical 100, ECC at 85, Hybrid PQC at 20, and full ML-KEM/ML-DSA arrays score 0. Helps prioritize remediation efforts mathematically.

### 7. Reporting
- **Features**: Automated, comprehensive audit report generation.
- **Important Functionalities**: Compiles Triad scan results, CBOMs, and QVS ratings into a structured PDF. Integrates with SMTP (Gmail deployment) for automated dispatch directly to the evaluator/CISO inbox.

### 8. Triad Scanner (Core Engine)
- **Features**: The heart of Qubit-Guard, examining critical attack surfaces concurrently.
- **Important Functionalities**:
  - **Pillar A (Web/TLS)**: Real-time TLS handshake probing on web servers (e.g., Nginx, Apache) to detect legacy certificates.
  - **Pillar B (VPN/TLS)**: Analysis of VPN gateway protocols (IKEv2, SSL-VPN) for RFC 9370 multi-key exchange support.
  - **Pillar C (API Security)**: An interactive JWT token and mTLS validation sandbox to identify quantum-forgeable signing algorithms (RS256, ES256).

### 9. Mobile App Scanning
- **Features**: Verifies the authenticity of PNB applications in the mobile ecosystem.
- **Important Functionalities**: Identifies official vs. cloned apps, defending against unauthorized rogue distribution and ensuring mobile pillar integrity.

### 10. Auto-Remediation
- **Features**: Step-by-step resolution of identified vulnerabilities.
- **Important Functionalities**: Powered by Google Gemini. Provides interactive chat and generates context-aware, deployment-ready copy-paste code snippets for Nginx hardening, OpenVPN patches, and Python-based JWT migration (e.g., upgrading to ML-DSA).

### 11. Q-Day Simulation
- **Features**: Interactive "Harvest-Now-Decrypt-Later" (HNDL) visualizer.
- **Important Functionalities**: Calculates "Time To Exposure" (TTE) based on current risk scores, tangibly demonstrating the business impact of quantum threats to executive decision-makers.

### 12. PQC Selector (Smart Engine)
- **Features**: An ML-based Smart Selector for optimal algorithm assignment.
- **Important Functionalities**: Takes inputs like bandwidth (kbps), latency (ms), device type, retention period, and compliance mandate to recommend the mathematically optimal PQC algorithm with confidence scoring.

---

## 🧠 ML Dataset Details

The **PQC Selector** is powered by a pure-Python Random Forest classifier trained on a highly relevant, localized dataset to ensure optimal performance in Indian network environments:
- **Dataset Composition**: Sovereign Indian datasets modeled on **AIKosh network profiles** (IndiaAI Datasets Platform), mapping Indian ISP bandwidth and latency constraints (e.g., Jio Fiber vs. BSNL rural).
- **Benchmarks**: Integrated with **DST National PQC Testing & Certification Program (2026)** performance benchmarks.
- **Behavioral Data**: Weighted according to **I4C Cybercrime behavioral patterns**.

---

## 🔐 The 6 PQC Algorithms & Triad Focus

The platform implements 6 distinct families of algorithms to secure the Triad.

### 1. ML-KEM (Kyber)
- **Use Case**: Key Establishment in Web/TLS and VPN/TLS (Pillars A & B).
- **Benefits**: FIPS 203 finalized. Extremely fast key exchange with relatively small ciphertext sizes for lattice schemes, making it ideal for standard web traffic.
- **Drawbacks**: Potentially vulnerable to specific hardware-level side-channel attacks.
- **Future Mitigation**: Addressed via constant-time software implementations and hardware masking techniques.

### 2. ML-DSA (Dilithium)
- **Use Case**: General Digital Signatures for APIs and Authentication (Pillar C).
- **Benefits**: FIPS 204 finalized. Highly secure and offers very fast verification times.
- **Drawbacks**: Signature sizes are significantly larger than legacy ECC, which can impact latency on low-bandwidth connections.
- **Future Mitigation**: Implementation of advanced header compression algorithms and caching mechanisms in TLS 1.3 to reduce transmission overhead.

### 3. SLH-DSA (Sphincs+)
- **Use Case**: Highly conservative backup signing for high-value transactions (Pillar C).
- **Benefits**: Relies strictly on established hash functions rather than lattice assumptions. If lattice cryptography is ever broken, SLH-DSA remains mathematically secure.
- **Drawbacks**: Extremely large signature sizes and very slow performance.
- **Future Mitigation**: Relegated strictly as a "fallback" or "backup" mechanism for high-value HSM (Hardware Security Module) validations where speed is secondary to ultimate security.

### 4. FN-DSA (Falcon)
- **Use Case**: Compact signatures for Mobile constraints (Mobile/App Pillar).
- **Benefits**: Offers the smallest signature sizes among lattice-based schemes, making it perfect for mobile devices with restricted bandwidth.
- **Drawbacks**: Highly complex to implement securely due to its reliance on floating-point arithmetic.
- **Future Mitigation**: Development of hardware-accelerated CPU instructions and rigorous constant-time float replacements to prevent algorithmic timing attacks.

### 5. XMSS / LMS (Stateful Hash-Based)
- **Use Case**: System and Firmware Integrity (Firmware Pillar).
- **Benefits**: Finalized via NIST SP 800-208. Mathematically proven security for code-signing, ensuring firmware updates cannot be quantum-forged.
- **Drawbacks**: Highly sensitive to "state management." Reusing a state (key index) completely breaks the security.
- **Future Mitigation**: Deployment within secure hardware enclaves employing strict, unalterable monotonic counters to physically prevent state reuse.

### 6. BIKE / HQC (Code-Based KEMs)
- **Use Case**: Archival and Long-Term Storage Encryption (Archival Pillar).
- **Benefits**: Based on error-correcting codes, offering a completely different hardness assumption than lattices. Provides excellent conservatism for data requiring decades-long retention protection.
- **Drawbacks**: Manifests larger public keys and slower key generation times compared to ML-KEM.
- **Future Mitigation**: Smooth integration directly into asynchronous, offline archival storage workflows where real-time latency optimization is not the primarily required metric.
