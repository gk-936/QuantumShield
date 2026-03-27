import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Network, Search, ShieldAlert, ShieldCheck } from 'lucide-react';

const Discovery = () => {
  const [target, setTarget] = useState('pnb.bank.in');
  const [discoveryInfo, setDiscoveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const runDiscovery = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/discovery/', { target });
      setDiscoveryInfo(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="page-discovery" className="page-view">
      <div className="card">
        <div className="card-title">Triad Asset Discovery (FR-01)</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="search-input" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            placeholder="Enter Domain or IP"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={runDiscovery} disabled={loading}>
            {loading ? 'DISCOVERING...' : 'RUN DISCOVERY SCAN'}
          </button>
        </div>

        {discoveryInfo && (
          <div className="discovery-results">
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div className={`stat-card ${discoveryInfo.pqc_ready ? 'safe' : 'danger'}`}>
                <div className="stat-value">{discoveryInfo.pqc_ready ? 'READY' : 'LEGACY'}</div>
                <div className="stat-label">PQC Alignment</div>
              </div>
              <div className="stat-card info">
                <div className="stat-value">{discoveryInfo.pillars.length}</div>
                <div className="stat-label">Pillars Detected</div>
              </div>
              <div className="stat-card info">
                <div className="stat-value">{discoveryInfo.details.tls_version || 'N/A'}</div>
                <div className="stat-label">TLS Protocol</div>
              </div>
            </div>

            <table className="data-table" style={{ marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Detected Pillar</th>
                  <th>Classification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {discoveryInfo.pillars.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 'bold' }}>{p}</td>
                    <td>{discoveryInfo.details.vpn_type || discoveryInfo.details.api_type || 'Standard Service'}</td>
                    <td><span className={`badge ${discoveryInfo.pqc_ready ? 'badge-safe' : 'badge-danger'}`}>{discoveryInfo.pqc_ready ? 'Quantum Resistant' : 'Vulnerable (HNDL)'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div className="card" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #FAECD4' }}>
            <div className="card-title" style={{ margin: 0 }}>🌐 Network Asset Graph</div>
            <div style={{ fontSize: '12px', color: '#7A5A30', marginTop: '8px' }}>Interactive topology visualization: {target}</div>
          </div>
          <div className="network-canvas-wrap" style={{ position: 'relative', height: '420px', background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF8E7 100%)', overflow: 'hidden', borderRadius: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 800 420" style={{ filter: 'drop-shadow(0 4px 12px rgba(100,30,0,0.08))' }}>
              <defs>
                <filter id="glow-node">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                </filter>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#E09D20', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#C8860A', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              {/* Central Target */}
              <g filter="url(#shadow)">
                <circle cx="400" cy="210" r="30" fill="url(#goldGrad)" filter="url(#glow-node)" />
                <circle cx="400" cy="210" r="35" fill="none" stroke="var(--pnb-gold)" strokeWidth="2" opacity="0.4">
                  <animate attributeName="r" from="35" to="50" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="400" cy="210" r="36" fill="none" stroke="var(--pnb-gold)" strokeWidth="1" opacity="0.2">
                  <animate attributeName="r" from="36" to="55" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
                </circle>
              </g>
              <text x="400" y="218" fill="#2C1A00" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="var(--mono)" style={{ pointerEvents: 'none' }}>TARGET</text>
              <text x="400" y="258" fill="#7A5A30" fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="var(--mono)" style={{ pointerEvents: 'none', wordBreak: 'break-all' }}>{target}</text>

              {/* Pillar Connections */}
              {discoveryInfo?.pillars.map((p, i) => {
                const angle = (i * 360 / discoveryInfo.pillars.length) * (Math.PI / 180);
                const x = 400 + 140 * Math.cos(angle);
                const y = 210 + 140 * Math.sin(angle);
                const isPqc = discoveryInfo.pqc_ready;
                const color = isPqc ? '#1A8A1A' : '#C0272D';
                const bgColor = isPqc ? '#F0FFF0' : '#FFF3F3';
                
                return (
                  <g key={i} style={{ cursor: 'pointer' }} opacity="0.9" onClick={() => navigate('/triad')}>
                    {/* Connection Line */}
                    <line x1="400" y1="210" x2={x} y2={y} stroke={color} strokeWidth="2.5" strokeDasharray="6 3" opacity="0.5" />
                    
                    {/* Node Circle Background */}
                    <circle cx={x} cy={y} r="32" fill={bgColor} stroke={color} strokeWidth="2.5" filter="url(#shadow)" />
                    <circle cx={x} cy={y} r="40" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
                    
                    {/* Node Content */}
                    <text x={x} y={y - 2} fill={color} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--mono)" style={{ pointerEvents: 'none', textTransform: 'uppercase' }}>
                      {p.split('/')[0].substring(0, 6)}
                    </text>
                    <text x={x} y={y + 10} fill="#7A5A30" fontSize="8" textAnchor="middle" fontFamily="var(--mono)" style={{ pointerEvents: 'none' }}>
                      {p.toUpperCase().includes('VPN') ? 'VPN' : p.toUpperCase().includes('API') ? 'API' : 'WEB'}
                    </text>
                    
                    {/* Status Indicator */}
                    <circle cx={x + 22} cy={y - 22} r="6" fill={isPqc ? '#1A8A1A' : '#C0272D'} />
                    <circle cx={x + 22} cy={y - 22} r="3" fill="white" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="card" style={{ margin: 0, background: 'linear-gradient(135deg, #F5FBF5 0%, #F0FFF0 100%)', borderLeft: '5px solid #1A8A1A' }}>
          <div className="card-title" style={{ fontSize: '14px', color: '#1A8A1A' }}>🛡️ Discovery Guide</div>
          <div style={{ fontSize: '12px', lineHeight: '1.7', color: '#2C1A00' }}>
            <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(26, 138, 26, 0.05)', borderRadius: '8px', borderLeft: '3px solid #1A8A1A' }}>
              <b style={{ color: '#1A8A1A' }}>⬡ TSP Probe:</b>
              <p style={{ margin: '4px 0 0 0', opacity: 0.85 }}>Identifies PNB Web, VPN, and API endpoints across CIDR ranges.</p>
            </div>
            <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(192, 39, 45, 0.05)', borderRadius: '8px', borderLeft: '3px solid #C0272D' }}>
              <b style={{ color: '#C0272D' }}>⬡ Vuln Mapping:</b>
              <p style={{ margin: '4px 0 0 0', opacity: 0.85 }}>Cryptographic weakness detection (RSA-2048, ECC-P256).</p>
            </div>
            <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(200, 134, 10, 0.05)', borderRadius: '8px', borderLeft: '3px solid #C8860A' }}>
              <b style={{ color: '#C8860A' }}>⬡ HNDL Risk:</b>
              <p style={{ margin: '4px 0 0 0', opacity: 0.85 }}>Flags harvest-now-decrypt-later vulnerabilities.</p>
            </div>
            <button className="btn btn-gold btn-sm" style={{ width: '100%', marginTop: '12px' }} onClick={() => navigate('/triad')}>⚡ Run Deep Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
