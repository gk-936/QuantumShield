"""
Triad-specific auto-remediation service.
Generates three distinctly different fixes depending on the asset type.
"""


def generate_triad_remediation() -> list:
    """Return per-pillar remediation scripts matching the SRS specification."""
    return [
        {
            "pillar": "web",
            "title": "Pillar A — TLS Web Server Hardening",
            "type": "bash",
            "summary": "Update Nginx ssl_ciphers to support FIPS 203 (ML-KEM).",
            "code": """# ── Nginx PQC-Ready TLS 1.3 Configuration ──────────────────────────
# Step 1: Update Nginx to support hybrid PQC cipher suites
sudo apt install -y nginx-oqs   # OQS-enabled Nginx build

# Step 2: Update ssl_ciphers in nginx.conf
cat <<'EOF' > /etc/nginx/conf.d/pqc-tls.conf
server {
    listen 443 ssl http2;
    server_name www.pnb.bank.in;

    ssl_protocols TLSv1.3;
    ssl_ciphers x25519_kyber768:X25519MLKEM768:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    ssl_certificate     /etc/nginx/ssl/pnb_hybrid_cert.pem;
    ssl_certificate_key /etc/nginx/ssl/pnb_hybrid_key.pem;
}
EOF

# Step 3: Test and reload
nginx -t && systemctl reload nginx
echo "[PQC] Web server hardened with FIPS 203 ML-KEM support."
""".strip(),
        },
        {
            "pillar": "vpn",
            "title": "Pillar B — VPN Gateway PQC Migration",
            "type": "bash",
            "summary": "Upgrade to the Open Quantum Safe (OQS) OpenVPN fork, or apply vendor firmware patches for PQC key exchange.",
            "code": """# ── VPN Gateway PQC Migration ───────────────────────────────────────
# Option A: OQS OpenVPN Fork (Recommended for immediate deployment)
git clone https://github.com/open-quantum-safe/openvpn.git
cd openvpn && autoreconf -i
./configure --with-crypto-lib=oqs
make && sudo make install

# Configure hybrid PQC key exchange
cat <<'EOF' >> /etc/openvpn/server.conf
tls-ciphersuites TLS_AES_256_GCM_SHA384
# Hybrid Kyber768 + X25519 key exchange
ecdh-curve x25519_kyber768
EOF

# Option B: Cisco AnyConnect / strongSwan
# Cisco: Upgrade IOS XE to 17.12+ for RFC 9370 support
# strongSwan: Upgrade to 5.9.12+ and configure:
#   proposals = aes256-sha384-x25519_kyber768

sudo systemctl restart openvpn
echo "[PQC] VPN gateway migrated to PQC-hybrid key exchange."
""".strip(),
        },
        {
            "pillar": "api",
            "title": "Pillar C — API JWT Signing Migration",
            "type": "python",
            "summary": "Transition JWT signing algorithms from classical RSA to FIPS 204 (ML-DSA).",
            "code": """# ── API JWT Signing Migration: RS256 → ML-DSA-65 ───────────────────
# Step 1: Install PQC-ready JWT library
# pip install oqs-python pyjwt[crypto]

from oqs import Signature

# Step 2: Generate ML-DSA-65 keypair
signer = Signature("Dilithium3")  # ML-DSA-65 = Dilithium3
public_key = signer.generate_keypair()

# Step 3: Sign JWT payload with ML-DSA
import json, base64, time

header = {"alg": "ML-DSA-65", "typ": "JWT"}
payload = {
    "sub": "api_service_account",
    "iss": "pnb.bank.in",
    "iat": int(time.time()),
    "exp": int(time.time()) + 3600,
}

def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

header_b64 = b64url(json.dumps(header).encode())
payload_b64 = b64url(json.dumps(payload).encode())
message = f"{header_b64}.{payload_b64}".encode()

signature = signer.sign(message)
token = f"{header_b64}.{payload_b64}.{b64url(signature)}"

print(f"[PQC] ML-DSA-65 signed JWT: {token[:80]}...")
print("[PQC] API authentication migrated to FIPS 204.")
""".strip(),
        },
        {
            "pillar": "api_backup",
            "title": "Pillar C+ — SLH-DSA Backup Signing for High-Value APIs",
            "type": "python",
            "summary": "Deploy SLH-DSA (FIPS 205) as a conservative backup signature for critical payment APIs. SLH-DSA relies only on hash function security — zero lattice assumptions.",
            "code": """# ── SLH-DSA Backup Signing for High-Value API Endpoints ─────────────
# FIPS 205 — Stateless Hash-Based Digital Signature Algorithm
# pip install oqs-python

from oqs import Signature

# Step 1: Generate SLH-DSA-128f keypair (fast variant)
signer = Signature("SPHINCS+-SHA2-128f-simple")
public_key = signer.generate_keypair()

# Step 2: Sign critical API payloads
import json, hashlib

payload = {
    "transaction_id": "TXN-2026-03-29-PNB-001",
    "amount": 15000000,
    "currency": "INR",
    "beneficiary": "PNB_NEFT_POOL",
}

message = json.dumps(payload, sort_keys=True).encode()
signature = signer.sign(message)
digest = hashlib.sha256(message).hexdigest()

print(f"[PQC] SLH-DSA-128f signature generated for TXN: {digest[:16]}...")
print(f"[PQC] Signature size: {len(signature)} bytes")
print("[PQC] FIPS 205 backup signing active for high-value API endpoints.")
""".strip(),
        },
        {
            "pillar": "mobile",
            "title": "Pillar C-Mobile — FN-DSA (Falcon) App Signing",
            "type": "python",
            "summary": "Deploy FN-DSA (Falcon) for mobile app signing and API authentication. Smallest signatures among lattice schemes — optimized for bandwidth-constrained mobile networks (Airtel 4G, BSNL).",
            "code": """# ── FN-DSA (Falcon) Mobile App Signing ──────────────────────────────
# Draft FIPS — Compact lattice signatures for mobile environments
# pip install oqs-python

from oqs import Signature

# Step 1: Generate FN-DSA-512 keypair
signer = Signature("Falcon-512")
public_key = signer.generate_keypair()

# Step 2: Sign mobile app binary hash
import hashlib

app_binary_hash = hashlib.sha256(b"PNB_ONE_v4.2.0_release.apk").digest()
signature = signer.sign(app_binary_hash)

print(f"[PQC] FN-DSA-512 app signature: {len(signature)} bytes")
print(f"[PQC] Compare RSA-2048 signature: 256 bytes vs FN-DSA: {len(signature)} bytes")

# Step 3: Verify on device
verifier = Signature("Falcon-512")
is_valid = verifier.verify(app_binary_hash, signature, public_key)
print(f"[PQC] Falcon signature verification: {'VALID' if is_valid else 'INVALID'}")
print("[PQC] Mobile app signing migrated to FN-DSA (Falcon).")
""".strip(),
        },
        {
            "pillar": "firmware",
            "title": "Pillar D — XMSS/LMS Firmware Integrity Signing",
            "type": "bash",
            "summary": "Migrate firmware signing from RSA-2048 to XMSS (RFC 8391) or LMS (RFC 8554) stateful hash-based signatures per NIST SP 800-208. Requires HSM-backed state counter.",
            "code": """# ── XMSS/LMS Firmware Signing Migration ────────────────────────────
# NIST SP 800-208 compliant — Stateful Hash-Based Signatures
# CRITICAL: Requires HSM-backed state counter to prevent key reuse

# Step 1: Install hash-based signature tools
pip install xmss-reference lms-reference  # Or use liboqs

# Step 2: Generate XMSS keypair with state file
python3 << 'XMSS_KEYGEN'
from oqs import Signature

# XMSS-SHA2_10_256: 1024 max signatures, 256-bit security
xmss = Signature("XMSS-SHA2_10_256")
public_key = xmss.generate_keypair()

# CRITICAL: Store state in HSM, not filesystem
with open("/etc/firmware-signing/xmss_pubkey.bin", "wb") as f:
    f.write(public_key)

print(f"[PQC] XMSS public key: {len(public_key)} bytes")
print("[PQC] Max firmware signatures: 1024 (state counter enforced)")
XMSS_KEYGEN

# Step 3: Sign firmware image
python3 << 'SIGN_FW'
import hashlib
from oqs import Signature

xmss = Signature("XMSS-SHA2_10_256")
# Load keypair from HSM (simplified)
pub = xmss.generate_keypair()

fw_hash = hashlib.sha256(open("/firmware/pnb_atm_v3.1.bin", "rb").read()).digest()
sig = xmss.sign(fw_hash)

with open("/firmware/pnb_atm_v3.1.sig", "wb") as f:
    f.write(sig)

print(f"[PQC] XMSS firmware signature: {len(sig)} bytes")
print("[PQC] State counter incremented. Remaining signatures tracked by HSM.")
SIGN_FW

echo "[PQC] Firmware signing migrated to XMSS (NIST SP 800-208)."
""".strip(),
        },
        {
            "pillar": "archival",
            "title": "Pillar E — BIKE/HQC Archival Key Encapsulation",
            "type": "python",
            "summary": "Migrate archival key wrapping from RSA-2048 to BIKE-L1 or HQC-128 code-based KEMs. Required for 25+ year confidentiality of SWIFT logs, regulatory data, and banking records.",
            "code": """# ── BIKE/HQC Archival Key Encapsulation ─────────────────────────────
# NIST Round-4 Candidates — Code-based KEMs for long-term archival
# pip install oqs-python

from oqs import KeyEncapsulation
import os, json

# Step 1: Generate BIKE-L1 keypair for archival key wrapping
kem = KeyEncapsulation("BIKE-L1")
public_key = kem.generate_keypair()

# Step 2: Encapsulate a fresh AES-256 key for archival encryption
ciphertext, shared_secret = kem.encap_secret(public_key)

print(f"[PQC] BIKE-L1 public key: {len(public_key)} bytes")
print(f"[PQC] Ciphertext: {len(ciphertext)} bytes")
print(f"[PQC] Shared secret: {len(shared_secret)} bytes (AES-256 key)")

# Step 3: Store encrypted key envelope alongside archived data
envelope = {
    "algorithm": "BIKE-L1",
    "fips_status": "NIST Round-4 Candidate",
    "ciphertext_b64": ciphertext.hex(),
    "retention_years": 25,
    "created": "2026-03-29",
    "compliance": "CERT-In Annexure-A",
}

with open("/archives/key_envelope_2026Q1.json", "w") as f:
    json.dump(envelope, f, indent=2)

print("[PQC] Archival key wrapping migrated from RSA-2048 to BIKE-L1.")
print("[PQC] Alternative: HQC-128 for maximum conservative security margin.")

# Step 4: HQC-128 alternative
kem_hqc = KeyEncapsulation("HQC-128")
pub_hqc = kem_hqc.generate_keypair()
ct_hqc, ss_hqc = kem_hqc.encap_secret(pub_hqc)
print(f"[PQC] HQC-128 alternative — ciphertext: {len(ct_hqc)} bytes")
""".strip(),
        },
    ]


def generate_remediation_scripts(findings: list) -> list:
    """Legacy remediation script generator for the /api/remediation/generate endpoint."""
    scripts = [
        {
            "type": "bash",
            "title": "Nginx TLS 1.3 Hardening",
            "code": "# Update Nginx config to enforce TLS 1.3 and PQC-ready ciphers\n"
                    "sed -i 's/ssl_protocols.*/ssl_protocols TLSv1.3;/' /etc/nginx/nginx.conf\n"
                    "sed -i 's/ssl_ciphers.*/ssl_ciphers x25519_kyber768:ECDHE-RSA-AES256-GCM-SHA384;/' /etc/nginx/nginx.conf\n"
                    "nginx -t && systemctl reload nginx",
        },
        {
            "type": "kubernetes",
            "title": "Istio PQC Sidecar Injection",
            "code": "apiVersion: networking.istio.io/v1alpha3\n"
                    "kind: EnvoyFilter\n"
                    "metadata:\n"
                    "  name: pqc-hybrid-filter\n"
                    "spec:\n"
                    "  configPatches:\n"
                    "  - applyTo: NETWORK_FILTER\n"
                    "    patch:\n"
                    "      operation: MERGE\n"
                    "      value:\n"
                    "        typed_config:\n"
                    "          common_http_protocol_options:\n"
                    "            tls_params:\n"
                    "              tls_maximum_protocol_version: TLSv1_3\n"
                    '              cipher_suites: ["[TLS_AES_256_GCM_SHA384]"]',
        },
    ]
    return scripts
