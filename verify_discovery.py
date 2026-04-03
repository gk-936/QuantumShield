import sys
import os
import socket
from unittest.mock import patch, MagicMock

# Add the project root to sys.path
sys.path.append(os.path.join(os.getcwd(), "backend"))

# Mock dns module for tests
sys.modules["dns"] = MagicMock()
sys.modules["dns.resolver"] = MagicMock()
sys.modules["dns.zone"] = MagicMock()
sys.modules["dns.query"] = MagicMock()

from services.discovery_service import discover_pnb_assets, generate_permutations, extract_sans

def test_permutations():
    print("[TEST] Testing permutations...")
    perms = generate_permutations("api")
    assert "api-dev" in perms
    assert "api-prod" in perms
    print("[PASS] Permutations generated correctly.")

def test_san_extraction():
    print("[TEST] Testing SAN extraction...")
    mock_cert = {
        'subjectAltName': (('DNS', 'www.example.com'), ('DNS', 'api.example.com'))
    }
    sans = extract_sans(mock_cert)
    assert "www.example.com" in sans
    assert "api.example.com" in sans
    print("[PASS] SAN extraction works.")

@patch("services.discovery_service.socket.gethostbyname")
@patch("services.discovery_service.socket.create_connection")
@patch("services.discovery_service.ssl.create_default_context")
def test_discovery_flow(mock_ssl_context, mock_create_conn, mock_gethost):
    print("[TEST] Testing discovery flow (Mocked)...")
    
    # Mock DNS resolution for a few subs
    def mock_gethost_side_effect(host):
        if host in ["target.com", "www.target.com", "api.target.com"]:
            return "127.0.0.1"
        raise socket.gaierror("DNS fail")
    
    mock_gethost.side_effect = mock_gethost_side_effect
    
    # Mock TLS probe
    mock_sock = MagicMock()
    mock_create_conn.return_value.__enter__.return_value = mock_sock
    
    # Mock SSL wrap
    mock_tls_sock = MagicMock()
    mock_tls_sock.version.return_value = "TLSv1.3"
    mock_tls_sock.getpeercert.return_value = {'subjectAltName': (('DNS', 'internal-api.target.com'),)}
    mock_ssl_context.return_value.wrap_socket.return_value.__enter__.return_value = mock_tls_sock
    
    result = discover_pnb_assets("target.com")
    
    assert result["total_found"] >= 2
    hosts = [a["host"] for a in result["assets"]]
    assert "www.target.com" in hosts
    assert "api.target.com" in hosts
    
    # Check Pillar A (Web/TLS)
    web_assets = [a for a in result["assets"] if "Web/TLS" in a["pillars"]]
    assert len(web_assets) > 0
    assert web_assets[0]["pqc_ready"] is True
    
    print(f"[PASS] Discovery flow found {result['total_found']} assets.")

if __name__ == "__main__":
    try:
        test_permutations()
        test_san_extraction()
        test_discovery_flow()
        print("\n[SUCCESS] All discovery service tests passed!")
    except Exception as e:
        print(f"\n[FAILURE] Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
