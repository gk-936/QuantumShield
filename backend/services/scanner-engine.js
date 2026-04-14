const tls = require('tls');
const url = require('url');
const net = require('net');
const axios = require('axios');

/**
 * Helper to probe for VPN/Gateway ports.
 */
async function _probeVPNPorts(host) {
  const ports = [443, 4443, 8443, 10443]; // Common SSL-VPN / Gateway ports
  const results = [];
  
  const probes = ports.map(port => {
    return new Promise((resolve) => {
      const socket = net.connect(port, host);
      socket.setTimeout(2000);
      socket.on('connect', () => { socket.end(); resolve({ port, open: true }); });
      socket.on('error', () => resolve({ port, open: false }));
      socket.on('timeout', () => { socket.destroy(); resolve({ port, open: false }); });
    });
  });

  const discovered = await Promise.all(probes);
  return discovered.filter(p => p.open);
}

/**
 * Pillar D: Firmware Integrity Probe
 */
async function _scanFirmware(host, certInfo) {
    const findings = [];
    const paths = ['/firmware', '/update', '/ota', '/.well-known/security.txt', '/fw-update'];
    const discoveredPaths = [];

    for (const path of paths) {
        try {
            const resp = await axios.head(`https://${host}${path}`, { timeout: 2000, validateStatus: (s) => s < 400 });
            discoveredPaths.push(path);
        } catch (e) { /* ignore fails */ }
    }

    if (certInfo) {
        const isRSA = certInfo.cipher.name.includes('RSA');
        findings.push({
            severity: isRSA ? 'critical' : 'high',
            issue: `Quantum-Vulnerable Firmware Signing Inferred: ${isRSA ? 'RSA' : 'ECC'}`,
            detail: `Observed PKI for ${host} uses ${certInfo.cipher.name}. Standard supply chain practices typically share this CA for code-signing. Vulnerable to forgery via Shor's algorithm.`,
            recommended: 'Migrate firmware root-of-trust to XMSS (RFC 8391) or LMS (RFC 8554).'
        });
    }

    if (discoveredPaths.length > 0) {
        findings.push({
            severity: 'high',
            issue: `${host} Embedded Firmware Asset`,
            detail: `Sensitive paths detected: ${discoveredPaths.join(', ')}. Unauthenticated access increases local supply-chain risk.`,
            recommended: 'Restrict firmware update paths to internal networks or enforce mTLS.'
        });
    }

    return findings;
}

/**
 * Pillar E: Archival Encryption Probe
 */
async function _scanArchival(host, certInfo) {
    const findings = [];
    let cloudFound = null;

    try {
        const resp = await axios.head(`https://${host}/`, { timeout: 2000 });
        const headers = resp.headers;
        if (headers['x-amz-server-side-encryption']) cloudFound = 'AWS';
        if (headers['x-ms-server-encrypted']) cloudFound = 'Azure';
        if (headers['x-goog-encryption-algorithm']) cloudFound = 'GCP';
    } catch (e) { /* ignore */ }

    if (cloudFound) {
        findings.push({
            severity: 'info',
            issue: `Cloud Archival Storage Detected (${cloudFound})`,
            detail: `Identified server-side encryption headers from ${cloudFound}.`,
            recommended: 'Transition Key-Wrap to BIKE-L1 or HQC-128 for 25+ year confidentiality.'
        });
    }

    if (certInfo && (certInfo.cipher.name.includes('RSA') || certInfo.cipher.name.includes('ECDHE'))) {
        findings.push({
            severity: 'high',
            issue: `${host} Archival HNDL Risk`,
            detail: `Use of ${certInfo.cipher.name} for key wrapping represents a Harvest-Now-Decrypt-Later (HNDL) threat. Recorded encrypted blobs can be decrypted post-quantum.`,
            recommended: 'Implement hybrid KEM envelopes (e.g., RSA + BIKE) for long-lived archival data.'
        });
    }

    return findings;
}

/**
 * Core engine for performing Triad Scans (5 Pillars: Web, VPN, API, Firmware, Archival).
 */
async function performTriadScan(webUrl, vpnUrl, apiUrl, jwtToken) {
  console.log(`[ENGINE] Starting full 5-pillar scan for ${webUrl}...`);

  const results = {
    timestamp: new Date().toISOString(),
    id: `scan_${Date.now()}`,
    findings: {
      web: [],
      vpn: [],
      api: [],
      firmware: [],
      archival: []
    },
    metrics: { riskScore: 0 }
  };

  const webParsed = url.parse(webUrl.startsWith('http') ? webUrl : `https://${webUrl}`);
  const webHost = webParsed.hostname || webUrl;
  let certData = null;

  try {
    // 1. Real Web/TLS Probing (Pillar A)
    const host = webHost;
    const port = webParsed.port || 443;

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
      certData = certInfo;
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

  // 2. VPN/TLS Probing (Pillar B)
  const vpnHost = vpnUrl || (webUrl.includes('.') ? `vpn.${webUrl.split('/')[0]}` : null);
  if (vpnHost) {
      const openPorts = await _probeVPNPorts(vpnHost);
      if (openPorts.length > 0) {
          results.findings.vpn.push({
            severity: 'high',
            issue: `Live VPN Gateway Detected on Port ${openPorts[0].port}`,
            detail: `Probing ${vpnHost} revealed an active gateway node. Classical RSA/ECC is expected.`,
            recommended: 'Implement hybrid PQC key exchange (RFC 9370)'
          });
      } else {
          results.findings.vpn.push({
            severity: 'info',
            issue: 'No VPN Infrastructure Detected',
            detail: `Standard VPN ports on ${vpnHost} are not reachable.`,
            recommended: 'N/A'
          });
      }
  }

  // 3. API/JWT Analysis (Pillar C)
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
    } catch (e) { /* invalid jwt */ }
  }

  // 4 & 5. Firmware (Pillar D) and Archival (Pillar E)
  const webHost = url.parse(webUrl.startsWith('http') ? webUrl : `https://${webUrl}`).hostname || webUrl;
  results.findings.firmware = await _scanFirmware(webHost, certData);
  results.findings.archival = await _scanArchival(webHost, certData);

  return results;
}

module.exports = { performTriadScan };
