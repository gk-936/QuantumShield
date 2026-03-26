import React from 'react';

const Home = () => {
  return (
    <div id="page-home" className="page-view">
      <div className="home-summary-grid">
        <div className="home-summary-card">
          <span className="hsc-icon">🔍</span>
          <div>
            <div className="hsc-val">212,450</div>
            <div className="hsc-lbl">Assets Discovery</div>
            <div className="hsc-sub">Domains, IPs & Subdomains</div>
          </div>
        </div>
        <div className="home-summary-card" style={{ borderLeftColor: '#1A6BAA' }}>
          <span className="hsc-icon">🛡️</span>
          <div>
            <div className="hsc-val" style={{ color: '#1A6BAA' }}>755/1000</div>
            <div className="hsc-lbl">Cyber Rating</div>
            <div className="hsc-sub" style={{ color: '#1A6BAA' }}>Elite-PQC Status</div>
          </div>
        </div>
        <div className="home-summary-card" style={{ borderLeftColor: '#1A8A1A' }}>
          <span className="hsc-icon">📋</span>
          <div>
            <div className="hsc-val" style={{ color: '#1A8A1A' }}>93</div>
            <div className="hsc-lbl">Active SSL Certs</div>
            <div className="hsc-sub" style={{ color: '#C0272D' }}>22 weak cryptography</div>
          </div>
        </div>
        <div className="home-summary-card" style={{ borderLeftColor: '#C0272D' }}>
          <span className="hsc-icon">⚠️</span>
          <div>
            <div className="hsc-val" style={{ color: '#C0272D' }}>8248</div>
            <div className="hsc-lbl">CBOM Vulnerabilities</div>
            <div className="hsc-sub" style={{ color: '#C0272D' }}>Requiring immediate action</div>
          </div>
        </div>
      </div>
      <div className="home-detail-grid">
        <div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">📊</span>Assets Inventory</div>
            <div className="grid-2" style={{ gap: '10px', marginBottom: '10px' }}>
              <div className="stat-chip"><div className="sc-val">8,761</div><div className="sc-lbl">SSL Certificates</div></div>
              <div className="stat-chip"><div className="sc-val">13,211</div><div className="sc-lbl">Software</div></div>
              <div className="stat-chip info"><div className="sc-val">3,854</div><div className="sc-lbl">IoT Devices</div></div>
              <div className="stat-chip warn"><div className="sc-val">1,198</div><div className="sc-lbl">Login Forms</div></div>
            </div>
            <div style={{ height: '160px' }}>
              {/* Chart.js Placeholder */}
              <div style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>[Inventory Chart Placeholder]</div>
            </div>
          </div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">🎯</span>Posture of PQC</div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>ML-KEM Adoption</span><span style={{ fontWeight: 700, color: 'var(--pnb-gold)' }}>33%</span></div>
              <div className="prog-bar"><div className="prog-fill pf-gold" style={{ width: '33%' }}></div></div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>ML-DSA Transition</span><span style={{ fontWeight: 700, color: 'var(--pnb-gold)' }}>22%</span></div>
              <div className="prog-bar"><div className="prog-fill pf-gold" style={{ width: '22%' }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Legacy Protocol Removal</span><span style={{ fontWeight: 700, color: '#C0272D' }}>8%</span></div>
              <div className="prog-bar"><div className="prog-fill pf-red" style={{ width: '8%' }}></div></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">⭐</span>Cyber Rating Distribution</div>
            <div style={{ height: '180px' }}>
              {/* Chart.js Placeholder */}
              <div style={{ textAlign: 'center', paddingTop: '70px', color: '#888' }}>[Rating Chart Placeholder]</div>
            </div>
            <div className="grid-4" style={{ gap: '8px', marginTop: '12px' }}>
              <div style={{ textAlign: 'center', padding: '8px', background: '#E8F0FF', borderRadius: '8px' }}><div style={{ fontWeight: 700, color: '#1A5ACC', fontSize: '13px' }}>Tier 1</div><div style={{ fontSize: '10px', color: '#666' }}>Excellent</div></div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#FFF0D0', borderRadius: '8px' }}><div style={{ fontWeight: 700, color: '#8A5000', fontSize: '13px' }}>Tier 2</div><div style={{ fontSize: '10px', color: '#666' }}>Good</div></div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#E8FFE8', borderRadius: '8px' }}><div style={{ fontWeight: 700, color: '#1A7A1A', fontSize: '13px' }}>Tier 3</div><div style={{ fontSize: '10px', color: '#666' }}>Satisfactory</div></div>
              <div style={{ textAlign: 'center', padding: '8px', background: '#FFE8E8', borderRadius: '8px' }}><div style={{ fontWeight: 700, color: '#C0272D', fontSize: '13px' }}>Tier 4</div><div style={{ fontSize: '10px', color: '#666' }}>Needs Help</div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">📋</span>CBOM Quick Overview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '130px' }}>
                <div style={{ textAlign: 'center', paddingTop: '50px', color: '#888' }}>[CBOM Chart Placeholder]</div>
              </div>
              <div>
                <div style={{ marginBottom: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#C0272D', borderRadius: '2px', display: 'inline-block' }}></span>Critical: <b>2,847</b></div>
                <div style={{ marginBottom: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#E8A030', borderRadius: '2px', display: 'inline-block' }}></span>High: <b>3,120</b></div>
                <div style={{ marginBottom: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#1A8A1A', borderRadius: '2px', display: 'inline-block' }}></span>Medium: <b>1,881</b></div>
                <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#1A5ACC', borderRadius: '2px', display: 'inline-block' }}></span>Low: <b>400</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
