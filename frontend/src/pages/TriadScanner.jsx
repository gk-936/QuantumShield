import React, { useState } from 'react';
import ApiMetrics from '../components/ApiMetrics';
import { runTriadScan as apiRunScan, chatWithExpert } from '../api';

const TriadScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [findings, setFindings] = useState({ web: [], vpn: [], api: [], firmware: [], archival: [] });
  const [riskScores, setRiskScores] = useState({ web: 0, vpn: 0, api: 0, firmware: 0, archival: 0, overall: 0 });
  const [selectorLog, setSelectorLog] = useState(null);
  const [apiMetrics, setApiMetrics] = useState(null);
  const [cbom, setCbom] = useState(null);
  const [remediation, setRemediation] = useState([]);
  const [scanProgress, setScanProgress] = useState('');
  const [tokenAnalysis, setTokenAnalysis] = useState('');
  const [analyzingToken, setAnalyzingToken] = useState(false);

  const handleTokenAnalysis = async () => {
    const token = document.getElementById('jwt-token-sandbox').value;
    if (!token) return;
    setAnalyzingToken(true);
    try {
      const res = await chatWithExpert(`Analyze this JWT token for PQC vulnerabilities and provide a QVS score (100/10/0) and NIST recommendation: ${token}`);
      setTokenAnalysis(res.data.text);
    } catch (e) {
      setTokenAnalysis('AI Analysis Failed. Ensure API Key is set.');
    } finally {
      setAnalyzingToken(false);
    }
  };

  const runTriadScan = async () => {
    setIsScanning(true);
    setShowResults(false);
    setScanProgress('Initializing Triad Scanning Engine...');

    try {
      setScanProgress('Probing Web/TLS endpoints...');
      await new Promise(r => setTimeout(r, 400));
      setScanProgress('Analyzing VPN gateway protocols...');
      await new Promise(r => setTimeout(r, 400));
      setScanProgress('Parsing API tokens & mTLS config...');

      const response = await apiRunScan({
        webUrl: document.getElementById('scan-web').value,
        vpnUrl: document.getElementById('scan-vpn').value,
        apiUrl: document.getElementById('scan-api').value,
        jwtToken: document.getElementById('jwt-token-sandbox').value
      });

      if (response.data.success) {
        const result = response.data.data;
        setFindings(result.findings);
        setRiskScores(result.riskScores || { web: 0, vpn: 0, api: 0, firmware: 0, archival: 0, overall: 0 });
        setApiMetrics(result.apiMetrics);
        setCbom(result.cbom);
        setRemediation(result.remediation || []);
        setSelectorLog(result.selectorLog || null);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Scan Failed:', err);
      alert('Scan failed. Ensure the Python/FastAPI backend is running on port 5006.');
    } finally {
      setIsScanning(false);
      setScanProgress('');
    }
  };

  const pillarMeta = {
    web: { tag: 'WEB PILLAR', title: 'TLS Certificate Engine', subtitle: 'Web Server Cryptanalysis', class: 'pillar-a', icon: '🌐' },
    vpn: { tag: 'VPN PILLAR', title: 'VPN/TLS Gateway Engine', subtitle: 'Gateway Protocol Analysis', class: 'pillar-b', icon: '🔒' },
    api: { tag: 'API PILLAR', title: 'API Security Engine', subtitle: 'JWT & mTLS Analysis', class: 'pillar-c', icon: '⚡' },
    firmware: { tag: 'FIRMWARE PILLAR', title: 'Firmware Integrity Engine', subtitle: 'XMSS/LMS Signing Analysis', class: 'pillar-d', icon: '🔧' },
    archival: { tag: 'ARCHIVAL PILLAR', title: 'Archival Encryption Engine', subtitle: 'BIKE/HQC KEM Analysis', class: 'pillar-e', icon: '🗄️' },
  };

  const qvsColor = (score) => {
    if (score >= 80) return '#C0272D';
    if (score >= 50) return '#D47800';
    if (score >= 20) return '#1A6BAA';
    return '#1A8A1A';
  };

  const qvsLabel = (score) => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 20) return 'MODERATE';
    return 'PQC-READY';
  };

  return (
    <div id="page-triad" className="page-view">

      {/* ── Input Area ───────────────────────────────────────────────── */}
      <div className="scan-input-area">
        <div className="card-title"><span className="ct-icon">⚡</span>Triad Scanner — Define Attack Surface</div>
        <div className="scan-row">
          <span className="scan-badge sb-web">WEB/TLS</span>
          <input type="text" id="scan-web" defaultValue="www.pnb.bank.in" className="form-input" style={{ flex: 1, fontFamily: 'var(--mono)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Port 443/TCP · Nginx / Apache / IIS</span>
        </div>
        <div className="scan-row">
          <span className="scan-badge sb-vpn">VPN/TLS</span>
          <input type="text" id="scan-vpn" defaultValue="vpn.pnb.bank.in" className="form-input" style={{ flex: 1, fontFamily: 'var(--mono)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Port 443/TCP · SSL-VPN / Cisco AnyConnect</span>
        </div>
        <div className="scan-row">
          <span className="scan-badge sb-api">API/TLS</span>
          <input type="text" id="scan-api" defaultValue="api.pnb.bank.in" className="form-input" style={{ flex: 1, fontFamily: 'var(--mono)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Port 443/TCP · REST / GraphQL / mTLS</span>
        </div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>⬡ API PILLAR — Paste a sample JWT or OAuth Bearer Token for signing-algorithm analysis</div>
          <textarea id="jwt-token-sandbox" className="form-input" style={{ width: '100%', height: '60px', fontFamily: 'var(--mono)', color: '#1A8A1A', background: '#F8FFF8' }} defaultValue="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.fakesig"></textarea>
        </div>
        <button
          className="btn btn-gold"
          style={{ marginTop: '12px', fontSize: '16px', width: '100%' }}
          onClick={runTriadScan}
          disabled={isScanning}
        >
          {isScanning ? '⏳ SCANNING...' : '⚡ INITIATE TRIAD SCAN'}
        </button>
      </div>

      {/* ── Scan Progress ────────────────────────────────────────────── */}
      {isScanning && (
        <div className="scan-progress-bar">
          <div className="scan-progress-pulse"></div>
          <span className="scan-progress-text">{scanProgress}</span>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────── */}
      {showResults && (
        <div id="triad-results">

          {/* QVS Overview */}
          <div className="grid-2" style={{ marginBottom: '16px' }}>
            <div className="card" style={{ margin: 0 }}>
              <div className="card-title" style={{ fontSize: '13px' }}>Quantum Vulnerability Score (QVS)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--disp)', fontSize: '64px', fontWeight: 700, color: qvsColor(riskScores.overall), lineHeight: 1, textShadow: `0 0 30px ${qvsColor(riskScores.overall)}33` }}>
                    {riskScores.overall}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '2px' }}>QVS / 100</div>
                  <div style={{ marginTop: '8px', padding: '4px 16px', border: `1px solid ${qvsColor(riskScores.overall)}80`, color: qvsColor(riskScores.overall), fontFamily: 'var(--mono)', fontSize: '11px', display: 'inline-block', borderRadius: '4px' }}>
                    {qvsLabel(riskScores.overall)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {['web', 'vpn', 'api', 'firmware', 'archival'].map((p) => (
                    <div key={p} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                        <span>{p === 'web' ? 'WEB / TLS' : p === 'vpn' ? 'VPN / TLS' : p === 'api' ? 'API / JWT' : p === 'firmware' ? 'FIRMWARE' : 'ARCHIVAL'}</span>
                        <span style={{ color: qvsColor(riskScores[p] || 0), fontWeight: 700 }}>{riskScores[p] || 0}</span>
                      </div>
                      <div className="prog-bar">
                        <div className="prog-fill pf-red" style={{ width: `${riskScores[p]}%`, background: `linear-gradient(90deg, ${qvsColor(riskScores[p])}, ${qvsColor(riskScores[p])}AA)` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ApiMetrics data={apiMetrics} />
          </div>

          {/* ── Three Pillar Cards ───────────────────────────────────── */}
          <div className="triad-grid">
            {Object.keys(findings).filter(pillar => pillarMeta[pillar]).map((pillar) => {
              const meta = pillarMeta[pillar];
              return (
                <div key={pillar} className={`pillar-card ${meta.class}`}>
                  <div className="pc-tag">{meta.icon} {meta.tag}</div>
                  <div className="pc-title">{meta.title}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '10px', fontFamily: 'var(--mono)' }}>{meta.subtitle}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '6px', fontFamily: 'var(--mono)', letterSpacing: '1px' }}>QVS: {riskScores[pillar]}/100</div>
                  <div className="pc-findings">
                    {findings[pillar].map((f, i) => (
                      <div key={i} className="pc-finding">
                        <div className={`pf-sev sev-${f.severity === 'critical' || f.severity === 'high' ? 'danger' : f.severity === 'info' ? 'safe' : 'warn'}`}></div>
                        <div>
                          <div style={{ fontSize: '11px', marginBottom: '2px', fontWeight: f.severity === 'critical' ? 700 : 500 }}>
                            {f.severity === 'critical' ? '🚨' : f.severity === 'high' ? '⚠' : f.severity === 'info' ? 'ℹ' : '⚠'} {f.issue}
                          </div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', opacity: 0.7, marginBottom: '3px' }}>{f.detail}</div>
                          {f.recommendation && (
                            <div style={{ fontSize: '9px', opacity: 0.9, background: 'rgba(255,255,255,0.1)', padding: '4px 6px', borderRadius: '4px', borderLeft: '2px solid rgba(255,255,255,0.4)' }}>
                              💡 {f.recommendation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CBOM Preview ─────────────────────────────────────────── */}
          {cbom && (
            <div className="card" style={{ borderLeft: '4px solid var(--pnb-gold)' }}>
              <div className="card-title" style={{ fontSize: '13px' }}><span className="ct-icon">📦</span> Unified CBOM (CycloneDX v1.5)</div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '10px', fontFamily: 'var(--mono)' }}>
                Serial: {cbom.serialNumber} | Spec: {cbom.specVersion}
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Component</th>
                    <th>Crypto</th>
                    <th>Quantum-Safe</th>
                  </tr>
                </thead>
                <tbody>
                  {cbom.components?.map((c, i) => (
                    <tr key={i}>
                      <td><span className={`risk-badge ${c.type === 'application' ? 'rb-high' : c.type === 'network-appliance' ? 'rb-medium' : 'rb-critical'}`}>{c.type}</span></td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{c.name}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#C0272D', fontWeight: 600 }}>{c.crypto}</td>
                      <td>{c.quantumSafe ? <span className="pqc-yes">✅</span> : <span className="pqc-no">❌</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Triad-Specific Remediation ───────────────────────────── */}
          {remediation.length > 0 && (
            <div className="card">
              <div className="card-title" style={{ fontSize: '13px' }}><span className="ct-icon">🔧</span> Triad-Specific Auto-Remediation</div>
              <div className="remed-grid">
                {remediation.map((r, i) => (
                  <RemediationCard key={i} data={r} />
                ))}
              </div>
            </div>
          )}

          {/* ── JWT Sandbox ───────────────────────────────────────────── */}
          <div className="jwt-sandbox card">
              <div className="card-title" style={{ fontSize: '13px' }}><span className="ct-icon">🔍</span> JWT Quantum Analysis Sandbox</div>
              <textarea className="form-input" placeholder="Paste JWT token here..." id="jwt-token-sandbox-results" defaultValue="eyJhbGciOiJSUzI1NiIs..." style={{ width: '100%', height: '60px', fontFamily: 'var(--mono)', color: '#1A8A1A', background: '#F8FFF8' }}></textarea>
              <button className="btn btn-red btn-sm" style={{ marginTop: '8px' }} onClick={handleTokenAnalysis} disabled={analyzingToken}>
                {analyzingToken ? '⏳ ANALYZING...' : '🔍 Analyze Token'}
              </button>
              {tokenAnalysis && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '3px solid #C0272D', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: '#C0272D' }}>🛡️ Architect Analysis:</div>
                  {tokenAnalysis}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Remediation Card Sub-component ──────────────────────────────────────── */
const RemediationCard = ({ data }) => {
  const [open, setOpen] = useState(false);
  const pillarColors = { web: '#1A6ACC', vpn: '#CC8A1A', api: '#1ACC5A', api_backup: '#22c55e', mobile: '#f59e0b', firmware: '#ef4444', archival: '#ec4899' };
  const color = pillarColors[data.pillar] || 'var(--pnb-gold)';

  return (
    <div className="remed-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="remed-header" onClick={() => setOpen(!open)} style={{ borderLeftColor: color }}>
        <div>
          <div style={{ fontFamily: 'var(--disp)', fontSize: '14px', fontWeight: 700, color: 'var(--pnb-red)' }}>{data.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{data.summary}</div>
        </div>
        <span style={{ fontSize: '18px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
      </div>
      {open && (
        <div className="remed-body open">
          <div className="code-snippet">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{data.code}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriadScanner;
