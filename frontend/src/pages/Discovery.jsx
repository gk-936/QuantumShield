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
        <div className="network-canvas-wrap" style={{ position: 'relative', height: '400px', background: '#0A0A0A', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--pnb-gold)', fontSize: '10px', fontFamily: 'var(--mono)', opacity: 0.7 }}>NET-GRAPH-PROBE: {target}</div>
          <svg width="100%" height="100%" viewBox="0 0 800 400">
            <defs>
              <filter id="glow-node"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {/* Central Target */}
            <circle cx="400" cy="200" r="20" fill="var(--pnb-gold)" filter="url(#glow-node)" />
            <circle cx="400" cy="200" r="25" fill="none" stroke="var(--pnb-gold)" strokeWidth="1" opacity="0.3">
              <animate attributeName="r" from="25" to="40" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="400" y="240" fill="white" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--mono)">{target}</text>

            {/* Pillar Connections */}
            {discoveryInfo?.pillars.map((p, i) => {
              const angle = (i * 360 / discoveryInfo.pillars.length) * (Math.PI / 180);
              const x = 400 + 160 * Math.cos(angle);
              const y = 200 + 160 * Math.sin(angle);
              const isPqc = discoveryInfo.pqc_ready;
              return (
                <g key={i} style={{ cursor: 'pointer' }} onClick={() => navigate('/triad')}>
                  <line x1="400" y1="200" x2={x} y2={y} stroke={isPqc ? '#1A8A1A' : '#C0272D'} strokeWidth="3" strokeDasharray="8 4" opacity="0.6" />
                  <circle cx={x} cy={y} r="35" fill="#111" stroke={isPqc ? '#1A8A1A' : '#C0272D'} strokeWidth="2" filter="url(#glow-node)" />
                  <text x={x} y={y + 5} fill="white" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--mono)">{p.toUpperCase().split('/')[0]}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="card" style={{ margin: 0, background: 'rgba(26, 138, 26, 0.05)', borderLeft: '4px solid var(--pnb-gold)' }}>
          <div className="card-title" style={{ fontSize: '14px' }}>🛡️ Discovery Feature Guide</div>
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '12px' }}>
              <b style={{ color: 'var(--pnb-red)' }}>⬡ Triple-Surface Probe (TSP):</b>
              <p style={{ margin: '4px 0 0 0', opacity: 0.8 }}>Automatically identifies PNB's Web, VPN, and API endpoints across global CIDR ranges.</p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <b style={{ color: 'var(--pnb-red)' }}>⬡ Vulnerability Mapping:</b>
              <p style={{ margin: '4px 0 0 0', opacity: 0.8 }}>Maps discovered endpoints to known cryptographic vulnerabilities (RSA-2048, ECC-P256).</p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <b style={{ color: 'var(--pnb-red)' }}>⬡ Harvest Now, Decrypt Later (HNDL):</b>
              <p style={{ margin: '4px 0 0 0', opacity: 0.8 }}>Flags services vulnerable to HNDL attacks that lack Hybrid PQC encapsulation.</p>
            </div>
            <button className="btn btn-gold btn-sm" style={{ width: '100%', marginTop: '10px' }} onClick={() => navigate('/triad')}>⚡ Run Deep Triad Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
