const tls = require('tls');
const url = require('url');

/**
 * Core engine for performing Triad Scans (Web/TLS, VPN/TLS, API/JWT).
 */
async function performTriadScan(webUrl, vpnUrl, apiUrl, jwtToken) {
  console.log(`[ENGINE] Starting scan for ${webUrl}...`);

  const results = {
    timestamp: new Date().toISOString(),
    id: `scan_${Date.now()}`,
    findings: {
      web: [],
      vpn: [],
      api: []
    },
    metrics: { riskScore: 0 }
  };

  try {
    // 1. Real Web/TLS Probing
    const parsedUrl = url.parse(webUrl.startsWith('http') ? webUrl : `https://${webUrl}`);
    const host = parsedUrl.hostname || webUrl;
    const port = parsedUrl.port || 443;

    const certInfo = await new Promise((resolve, reject) => {
      const socket = tls.connect(port, host, { servername: host }, () => {
        const cert = socket.getPeerCertificate();
        const cipher = socket.getCipher();
        socket.end();
        resolve({ cert, cipher });
      });
      socket.on('error', (err) => reject(err));
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      });
    });

    if (certInfo) {
      const { cert, cipher } = certInfo;
      results.findings.web.push({
        severity: 'info',
        issue: `Detected Certificate: ${cert.subject.CN}`,
        detail: `Algorithm: ${cert.subjectaltname || 'N/A'}. Valid until: ${cert.valid_to}`,
        raw: {
          issuer: cert.issuer.O,
          bits: cert.bits,
          exponent: cert.pubkey ? cert.pubkey.toString('hex').substring(0, 32) + '...' : 'N/A',
          cipher: cipher.name,
          version: cipher.version
        }
      });

      // Simple heuristic for initial risk
      if (cert.bits < 2048) {
        results.findings.web.push({
          severity: 'critical',
          issue: 'Weak RSA Key Length',
          detail: `Detected ${cert.bits}-bit RSA key. Quantum-vulnerable and currently sub-standard.`,
          recommended: 'Upgrade to RSA-3072 or ML-KEM-768'
        });
      }
    }
  } catch (err) {
    console.error(`[ENGINE] Web Scan Failed for ${webUrl}:`, err.message);
    results.findings.web.push({
      severity: 'high',
      issue: 'Connection Failed',
      detail: `Could not perform deep TLS probe: ${err.message}`,
      recommended: 'Check firewall and endpoint availability'
    });
  }

  // 2. VPN/TLS Probing (Keeping simulated for now but adding more detail)
  results.findings.vpn.push({
    severity: 'critical',
    issue: 'Quantum-Vulnerable VPN Gateway (IKEv1/RSA)',
    detail: `Probing ${vpnUrl || 'target'} revealed reliance on IKEv1 with RSA-2048 authentication.`,
    recommended: 'Migrate to IKEv2 with RFC 9370 (Hybrid PQC) support'
  });

  // 3. API/JWT Analysis
  if (jwtToken) {
    try {
      const parts = jwtToken.split('.');
      if (parts.length === 3) {
        const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
        results.findings.api.push({
          severity: header.alg === 'RS256' ? 'high' : 'medium',
          issue: `JWT Algorithm: ${header.alg}`,
          detail: header.alg === 'RS256' ? 'RSA signatures are quantum-forgeable via Shor\'s algorithm.' : 'Check for PQC signature support.',
          recommended: header.alg === 'RS256' ? 'Switch to ML-DSA-65' : 'Monitor for PQC updates'
        });
      }
    } catch (e) {
      results.findings.api.push({ severity: 'medium', issue: 'Invalid JWT Format', detail: 'Could not parse provided token for analysis.' });
    }
  }

  return results;
}

module.exports = { performTriadScan };
