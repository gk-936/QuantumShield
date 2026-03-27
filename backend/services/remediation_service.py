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
