import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScan } from '../context/ScanContext';

const Posture = () => {
  const navigate = useNavigate();
  const { activeData } = useScan();

  const qvs = activeData?.riskScores?.overall || 72;
  const readinessIndex = 100 - qvs;
  
  const complianceStats = [
    { title: 'NIST FIPS 203 (ML-KEM)', status: qvs < 20 ? 'COMPLIANT' : 'PARTIAL', color: qvs < 20 ? '#1A8A1A' : '#D47800', weight: `${100 - (activeData?.riskScores?.web || 80)}%` },
    { title: 'NIST FIPS 204 (ML-DSA)', status: qvs < 30 ? 'COMPLIANT' : 'PARTIAL', color: qvs < 30 ? '#1A8A1A' : '#D47800', weight: `${100 - (activeData?.riskScores?.api || 85)}%` },
    { title: 'NIST FIPS 205 (SLH-DSA)', status: 'PENDING', color: '#C0272D', weight: '10%' },
    { title: 'CERT-In Annexure-A', status: qvs < 50 ? 'COMPLIANT' : 'PARTIAL', color: qvs < 50 ? '#1A8A1A' : '#D47800', weight: `${ readinessIndex }%` },
  ];

  return (
    <div id="page-posture" className="page-view" style={{ background: '#F8FAFC' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '30px' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
             <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                 <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--pnb-gold)" strokeWidth="3" strokeDasharray={`${readinessIndex}, 100`} />
             </svg>
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--disp)', fontSize: '32px', fontWeight: 700 }}>{readinessIndex}%</div>
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
        <div className="card-title">Detailed Cryptographic Inventory & Audit Status — {activeData?.webUrl || 'Global'}</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Surface</th>
              <th>Active Algorithm</th>
              <th>QVS Score</th>
              <th>NIST Compliance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{activeData?.webUrl || 'www.pnbindia.in'}</td>
              <td><span className="risk-badge rb-low">WEB</span></td>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{activeData?.findings?.web?.[0]?.raw?.key_type || 'RSA-2048'}</td>
              <td><span style={{ color: (activeData?.riskScores?.web > 50 ? '#C0272D' : '#1A8A1A'), fontWeight: 700 }}>{activeData?.riskScores?.web ?? 95}</span></td>
              <td>{activeData?.riskScores?.web < 20 ? '✅ FIPS 203 Ready' : '❌ Quantum Vulnerable'}</td>
              <td><button className="btn btn-outline btn-sm" onClick={() => navigate('/inventory')}>Audit</button></td>
            </tr>
            <tr>
              <td>{activeData?.vpnUrl || 'vpn.pnb.bank.in'}</td>
              <td><span className="risk-badge rb-medium">VPN</span></td>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{activeData?.findings?.vpn?.[0]?.issue?.includes('IKEv2') ? 'IKEv2 (Fallback)' : 'Classical SSL-VPN'}</td>
              <td><span style={{ color: (activeData?.riskScores?.vpn > 50 ? '#C0272D' : '#1A8A1A'), fontWeight: 700 }}>{activeData?.riskScores?.vpn ?? 98}</span></td>
              <td>{activeData?.riskScores?.vpn < 20 ? '✅ PQC Enabled' : '❌ Legacy Tunnel'}</td>
              <td><button className="btn btn-gold btn-sm" onClick={() => navigate('/remediation')}>Remediate</button></td>
            </tr>
            <tr>
              <td>{activeData?.apiUrl || 'api-payments.pnb.in'}</td>
              <td><span className="risk-badge rb-critical">API</span></td>
              <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{activeData?.findings?.api?.[0]?.issue?.includes('JWT') ? 'RSA Signature' : 'ECDSA (P-256)'}</td>
              <td><span style={{ color: (activeData?.riskScores?.api > 50 ? '#C0272D' : '#1A8A1A'), fontWeight: 700 }}>{activeData?.riskScores?.api ?? 100}</span></td>
              <td>{activeData?.riskScores?.api < 20 ? '✅ FIPS 204 Ready' : '⚠️ Upgrade Recommended'}</td>
              <td><button className="btn btn-gold btn-sm" onClick={() => navigate('/pqc-selector')}>Fix Case</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posture;
