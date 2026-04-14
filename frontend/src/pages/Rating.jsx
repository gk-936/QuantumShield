import React from 'react';
import { useScan } from '../context/ScanContext';

const Rating = () => {
  const { activeData } = useScan();
  const qvs = activeData?.riskScores?.overall || 0;
  const ratingScore = activeData ? Math.max(0, 1000 - (qvs * 8)) : 0;
  const ratingLabel = !activeData ? '⭕ No Audit Data' : ratingScore > 700 ? '✓ Elite-PQC Status' : ratingScore > 400 ? '🔰 Standard Status' : '⭕ Legacy Status';

  return (
    <div id="page-rating" className="page-view">
      <div className="grid-2">
        <div>
          <div className="score-display">
            <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'rgba(255,255,255,.5)', letterSpacing: '3px', marginBottom: '8px' }}>CONSOLIDATED ENTERPRISE CYBER-RATING</div>
            <div className="score-num">{ratingScore}<span style={{ fontSize: '30px' }}>/1000</span></div>
            <div className="score-label" style={{ color: ratingScore > 700 ? '#1A8A1A' : ratingScore > 400 ? '#D47800' : '#C0272D' }}>{ratingLabel}</div>
          </div>
          <div className="card">
            <div className="card-title">Rating Scale</div>
            <table className="tier-table">
              <tbody>
                <tr><td>⭕ <b>Legacy</b></td><td style={{ color: '#C0272D', fontWeight: 700 }}>&lt; 400</td></tr>
                <tr><td>🔰 <b>Standard</b></td><td style={{ color: '#D47800', fontWeight: 700 }}>400 - 700</td></tr>
                <tr><td>✅ <b>Elite-PQC</b></td><td style={{ color: '#1A8A1A', fontWeight: 700 }}>&gt; 700</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Tier Classification Criteria</div>
          <p style={{ fontSize: '12px', color: '#666' }}>Tiers are determined based on cryptographic protocol strength, key sizes, and PQC readiness.</p>
          <table className="data-table" style={{ marginTop: '10px' }}>
            <thead><tr><th>Tier</th><th>Criteria</th></tr></thead>
            <tbody>
              <tr><td>Tier-1 Elite</td><td>TLS 1.3 only; ML-KEM/DSA active</td></tr>
              <tr><td>Tier-2 Standard</td><td>TLS 1.2+; RSA-2048+; No PQC</td></tr>
              <tr><td>Tier-3 Legacy</td><td>TLS 1.0/1.1 enabled; weak ciphers</td></tr>
              <tr><td>Tier-4 Critical</td><td>Cleartext protocols; RSA-1024 or lower; Critical exposure</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rating;
