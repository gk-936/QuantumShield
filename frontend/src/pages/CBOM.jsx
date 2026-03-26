import React from 'react';

const CBOM = () => {
  return (
    <div id="page-cbom" className="page-view">
      <div className="cbom-stats">
        <div className="cbom-stat"><div className="cs-val">17</div><div className="cs-lbl">Total Applications</div></div>
        <div className="cbom-stat"><div className="cs-val">56</div><div className="cs-lbl">Sites Surveyed</div></div>
        <div className="cbom-stat"><div className="cs-val">93</div><div className="cs-lbl">Active Certificates</div></div>
        <div className="cbom-stat danger"><div className="cs-val">22</div><div className="cs-lbl">Weak Cryptography</div></div>
        <div className="cbom-stat warn"><div className="cs-val">7</div><div className="cs-lbl">Certificate Issues</div></div>
      </div>
      <div className="cbom-charts">
        <div className="card" style={{ margin: 0 }}><div className="card-title" style={{ fontSize: '13px' }}>Key Length Distribution</div><div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div></div>
        <div className="card" style={{ margin: 0 }}><div className="card-title" style={{ fontSize: '13px' }}>Cipher Usage</div><div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div></div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title" style={{ fontSize: '13px' }}>Top Certificate Authorities</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div>
            <div style={{ fontSize: '12px' }}>
              <div style={{ marginBottom: '6px' }}>DigiCert (39)</div>
              <div style={{ marginBottom: '6px' }}>Thawte (39)</div>
              <div>Let's Encrypt</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Detailed Cryptographic Bill of Materials</div>
        <table className="data-table">
          <thead><tr><th>Application</th><th>Key Length</th><th>Cipher Suite</th><th>Certificate Authority</th></tr></thead>
          <tbody>
            <tr><td><b>portal.company.com</b></td><td>2048-Bit</td><td>ECDHE-RSA-AES256-GCM-SHA384</td><td>DigiCert</td></tr>
            <tr><td><b>vpn.company.com</b></td><td>4096-Bit</td><td>TC5HE-RSA_AE556-GCM-SHA384</td><td>COMODO</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <button className="btn btn-gold">📥 Download CycloneDX CBOM (JSON)</button>
        </div>
      </div>
    </div>
  );
};

export default CBOM;
