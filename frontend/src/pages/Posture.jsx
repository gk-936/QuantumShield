import React from 'react';
import { useNavigate } from 'react-router-dom';

const Posture = () => {
  const navigate = useNavigate();
  
  const complianceStats = [
    { title: 'NIST FIPS 203 (ML-KEM)', status: 'COMPLIANT', color: '#1A8A1A', weight: '30%' },
    { title: 'NIST FIPS 204 (ML-DSA)', status: 'PARTIAL', color: '#D47800', weight: '25%' },
    { title: 'NIST FIPS 205 (SLH-DSA)', status: 'PENDING', color: '#C0272D', weight: '10%' },
    { title: 'CERT-In Annexure-A', status: 'COMPLIANT', color: '#1A8A1A', weight: '35%' },
  ];

  return (
    <div id="page-posture" className="page-view" style={{ background: '#F8FAFC' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '30px' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
             <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--pnb-gold)" strokeWidth="3" strokeDasharray="72, 100" />
             </svg>
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--disp)', fontSize: '32px', fontWeight: 700 }}>72%</div>
          </div>
          <div style={{ marginTop: '15px', fontWeight: 700, fontSize: '18px' }}>PNB PQC Readiness Index</div>
          <p style={{ fontSize: '12px', color: '#666' }}>Standardized across NIST and CERT-In frameworks</p>
        </div>
        
        <div style={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {complianceStats.map((s, i) => (
            <div key={i} className="card" style={{ margin: 0, borderLeft: `5px solid ${s.color}` }}>
              <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6 }}>{s.title}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0', color: s.color }}>{s.status}</div>
              <div className="prog-bar" style={{ height: '6px' }}>
                <div className="prog-fill" style={{ width: s.weight, background: s.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Detailed Cryptographic Inventory & Audit Status</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Surface</th>
              <th>Protocol</th>
              <th>Active Algorithm</th>
              <th>QVS Score</th>
              <th>NIST Compliance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>www.pnbindia.in</td>
              <td><span className="risk-badge rb-low">WEB</span></td>
              <td>TLS 1.3</td>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>ML-DSA-65 (Hybrid)</td>
              <td><span style={{ color: '#1A8A1A', fontWeight: 700 }}>0</span></td>
              <td>✅ FIPS 204 Ready</td>
              <td><button className="btn btn-outline btn-sm" onClick={() => navigate('/inventory')}>Audit</button></td>
            </tr>
            <tr>
              <td>vpn.pnb.bank.in</td>
              <td><span className="risk-badge rb-medium">VPN</span></td>
              <td>IKEv2</td>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: '#C0272D' }}>RSA-2048 (Legacy)</td>
              <td><span style={{ color: '#C0272D', fontWeight: 700 }}>95</span></td>
              <td>❌ Quantum Vulnerable</td>
              <td><button className="btn btn-gold btn-sm" onClick={() => navigate('/remediation')}>Remediate</button></td>
            </tr>
            <tr>
              <td>api-payments.pnb.in</td>
              <td><span className="risk-badge rb-critical">API</span></td>
              <td>REST / mTLS</td>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: '#D47800' }}>ECDSA (P-384)</td>
              <td><span style={{ color: '#D47800', fontWeight: 700 }}>65</span></td>
              <td>⚠️ Upgrade Recommended</td>
              <td><button className="btn btn-gold btn-sm" onClick={() => navigate('/remediation')}>Fix Case</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posture;
