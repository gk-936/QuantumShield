import React from 'react';

const Posture = () => {
  return (
    <div id="page-posture" className="page-view">
      <div className="pqc-header-bar">
        <div className="pqc-hb-item"><div className="pqc-hb-val" style={{ color: '#4ACC4A' }}>45%</div><div className="pqc-hb-lbl">Elite-PQC Ready</div></div>
        <div className="pqc-hb-item"><div className="pqc-hb-val">30%</div><div className="pqc-hb-lbl">Standard</div></div>
        <div className="pqc-hb-item"><div className="pqc-hb-val" style={{ color: '#FFAA00' }}>15%</div><div className="pqc-hb-lbl">Legacy</div></div>
        <div className="pqc-hb-item"><div className="pqc-hb-val" style={{ color: '#FF5555' }}>8</div><div className="pqc-hb-lbl">Critical Apps</div></div>
      </div>
      <div className="card">
        <div className="card-title">Asset PQC Support Status</div>
        <table className="data-table">
          <thead><tr><th>Asset Name</th><th>IP Address</th><th>Type</th><th>TLS Version</th><th>Algorithm</th><th>QVS Score</th><th>PQC Support</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>pq.pnb.bank.in</td><td>103.109.225.128</td><td>Web</td><td>TLSv1.3</td><td>ML-DSA</td><td><span style={{ color: '#1A8A1A', fontWeight: 700 }}>0</span></td><td><span className="pqc-yes">✓</span></td><td><button className="btn btn-outline btn-sm">View</button></td></tr>
            <tr><td>api.pnb.bank.in</td><td>103.109.224.100</td><td>API</td><td>TLSv1.3</td><td>ECC</td><td><span style={{ color: '#D47800', fontWeight: 700 }}>85</span></td><td><span className="pqc-no">✗</span></td><td><button className="btn btn-gold btn-sm">Fix →</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posture;
