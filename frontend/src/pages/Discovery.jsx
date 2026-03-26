import React from 'react';

const Discovery = () => {
  return (
    <div id="page-discovery" className="page-view">
      <div className="tab-bar">
        <button className="tab-btn active">Domains (20)</button>
        <button className="tab-btn">SSL (15)</button>
        <button className="tab-btn">IP Address/Subnets (34)</button>
        <button className="tab-btn">Software (52)</button>
        <button className="tab-btn">Network Graph</button>
      </div>
      <div id="disc-domains" className="tab-content active">
        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div className="card-title" style={{ margin: 0 }}>Domain Assets</div>
            <div className="tab-bar" style={{ margin: 0 }}>
              <button className="tab-btn active btn-sm" style={{ fontSize: '11px', padding: '5px 12px' }}>New (5)</button>
              <button className="tab-btn btn-sm" style={{ fontSize: '11px', padding: '5px 12px' }}>False Positive (10)</button>
              <button className="tab-btn btn-sm" style={{ fontSize: '11px', padding: '5px 12px' }}>Confirmed (2)</button>
              <button className="tab-btn btn-sm" style={{ fontSize: '11px', padding: '5px 12px' }}>All (3)</button>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Detection Date</th>
                <th>Domain Name</th>
                <th>Registration Date</th>
                <th>Registrar</th>
                <th>Company Name</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>03 Mar 2026</td><td style={{ fontFamily: 'var(--mono)', color: '#1A5ACC' }}>www.cos.pnb.bank.in</td><td>17 Feb 2005</td><td>National Internet Exchange of India</td><td><span className="rb-elite">PNB</span></td></tr>
              <tr><td>17 Oct 2024</td><td style={{ fontFamily: 'var(--mono)', color: '#1A5ACC' }}>www2.pnbrrbkiosk.in</td><td>22 Mar 2021</td><td>National Internet Exchange of India</td><td><span className="rb-elite">PNB</span></td></tr>
              <tr><td>17 Oct 2024</td><td style={{ fontFamily: 'var(--mono)', color: '#1A5ACC' }}>upload.pnbuniv.net.in</td><td>22 Mar 2021</td><td>National Internet Exchange of India</td><td><span className="rb-elite">PNB</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="network-canvas-wrap" style={{ marginTop: '20px' }}>
        <div style={{ textAlign: 'center', paddingTop: '180px', color: 'rgba(255,255,255,0.5)' }}>[Network Graph Visualization Placeholder]</div>
        <div className="network-legend">
          <div className="nl-item"><div className="nl-dot" style={{ background: '#4A90D9' }}></div>Web Domain</div>
          <div className="nl-item"><div className="nl-dot" style={{ background: '#E8A030' }}></div>SSL Cert</div>
          <div className="nl-item"><div className="nl-dot" style={{ background: '#4ACC4A' }}></div>IP Address</div>
          <div className="nl-item"><div className="nl-dot" style={{ background: '#CC4A4A' }}></div>Scanning IP</div>
        </div>
      </div>
    </div>
  );
};

export default Discovery;
