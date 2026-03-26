import { runTriadScan as apiRunScan } from '../api';

const TriadScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [findings, setFindings] = useState({ web: [], vpn: [], api: [] });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [apiMetrics, setApiMetrics] = useState(null);

  const runTriadScan = async () => {
    setIsScanning(true);
    setShowResults(false);
    
    try {
      const response = await apiRunScan({
        webUrl: document.getElementById('scan-web').value,
        vpnUrl: document.getElementById('scan-vpn').value,
        apiUrl: document.getElementById('scan-api').value,
        jwtToken: document.getElementById('jwt-token').value
      });

      if (response.data.success) {
        const result = response.data.data;
        setFindings(result.findings);
        setAiAnalysis(result.aiAnalysis);
        setApiMetrics(result.apiMetrics);
        setShowResults(true);
      }
    } catch (err) {
      console.error('Scan Failed:', err);
      alert('Scan failed. Ensure backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div id="page-triad" className="page-view">
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
          <textarea id="jwt-token" className="form-input" style={{ width: '100%', height: '60px', fontFamily: 'var(--mono)', color: '#1A8A1A', background: '#F8FFF8' }} defaultValue="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
        </div>
        <button 
          className="btn btn-gold" 
          style={{ marginTop: '12px', fontSize: '16px' }} 
          onClick={runTriadScan}
          disabled={isScanning}
        >
          {isScanning ? '⏳ SCANNING...' : '⚡ INITIATE TRIAD SCAN'}
        </button>
      </div>

      {showResults && (
        <div id="triad-results">
          <div className="triad-grid">
            {Object.keys(findings).map((pillar) => (
              <div key={pillar} className={`pillar-card pillar-${pillar === 'web' ? 'a' : pillar === 'vpn' ? 'b' : 'c'}`}>
                <div className="pc-tag">{pillar.toUpperCase()} PILLAR</div>
                <div className="pc-title">{pillar === 'web' ? 'Web Server Cryptanalysis' : pillar === 'vpn' ? 'Gateway Protocol Analysis' : 'API Auth & Token Analysis'}</div>
                <div className="pc-findings">
                  {findings[pillar].map((f, i) => (
                    <div key={i} className="pc-finding">
                      <div className={`pf-sev sev-${f.severity === 'high' || f.severity === 'critical' ? 'danger' : 'warn'}`}></div>
                      <div>
                        <div style={{ fontSize: '11px', marginBottom: '2px' }}>⚠ {f.issue}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', opacity: 0.7 }}>{f.recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {aiAnalysis && (
            <div className="card" style={{ borderLeft: '4px solid var(--pnb-gold)' }}>
              <div className="card-title"><span className="ct-icon">🧠</span> AI-Driven Post-Quantum Analysis (Gemini 1.5)</div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#333' }}>{aiAnalysis.summary}</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {aiAnalysis.suggestions?.map((s, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: '#FFF8E7', border: '1px solid var(--pnb-gold)', borderRadius: '8px', fontSize: '11px' }}>
                    <b>{s.issue}:</b> {s.alternative}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid-2" style={{ marginBottom: '14px' }}>
            <div className="card" style={{ margin: 0 }}>
              <div className="card-title" style={{ fontSize: '13px' }}>Quantum Risk Assessment</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--disp)', fontSize: '64px', fontWeight: 700, color: '#C0272D', lineHeight: 1, textShadow: '0 0 30px rgba(192,39,45,.3)' }}>9.4</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '2px' }}>QUANTUM RISK / 10</div>
                  <div style={{ marginTop: '8px', padding: '4px 16px', border: '1px solid rgba(192,39,45,.5)', color: '#C0272D', fontFamily: 'var(--mono)', fontSize: '11px', display: 'inline-block' }}>CRITICAL</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '8px' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}><span>WEB / TLS</span><span style={{ color: '#C0272D', fontWeight: 700 }}>8.8</span></div><div className="prog-bar"><div className="prog-fill pf-red" style={{ width: '88%' }}></div></div></div>
                  <div style={{ marginBottom: '8px' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}><span>VPN / TLS</span><span style={{ color: '#C0272D', fontWeight: 700 }}>9.5</span></div><div className="prog-bar"><div className="prog-fill pf-red" style={{ width: '95%' }}></div></div></div>
                  <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}><span>API / JWT</span><span style={{ color: '#C0272D', fontWeight: 700 }}>10.0</span></div><div className="prog-bar"><div className="prog-fill pf-red" style={{ width: '100%' }}></div></div></div>
                </div>
              </div>
            </div>
            <ApiMetrics data={apiMetrics} />
          </div>
          <div className="jwt-sandbox">
            <div className="card-title" style={{ fontSize: '13px' }}>JWT Quantum Analysis Sandbox</div>
            <textarea className="jwt-input-area" placeholder="Paste JWT token here..." defaultValue="eyJhbGciOiJSUzI1NiIs..."></textarea>
            <button className="btn btn-red btn-sm" style={{ marginTop: '8px' }}>🔍 Analyze Token</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriadScanner;
