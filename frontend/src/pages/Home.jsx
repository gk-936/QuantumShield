import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../api';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pnb-gold)', fontFamily: 'var(--mono)' }}>Loading Dashboard Data...</div>;
  }

  if (!data) return <div style={{ padding: '40px', textAlign: 'center' }}>Error loading data.</div>;

  return (
    <div id="page-home" className="page-view">
      <div className="home-summary-grid">
        <div className="home-summary-card">
          <span className="hsc-icon">🔍</span>
          <div>
            <div className="hsc-val">{data.summary.assetsDiscovery.value}</div>
            <div className="hsc-lbl">{data.summary.assetsDiscovery.label}</div>
            <div className="hsc-sub">{data.summary.assetsDiscovery.subtext}</div>
          </div>
        </div>
        <div className="home-summary-card" style={{ borderLeftColor: '#1A6BAA' }}>
          <span className="hsc-icon">🛡️</span>
          <div>
            <div className="hsc-val" style={{ color: '#1A6BAA' }}>{data.summary.cyberRating.value}</div>
            <div className="hsc-lbl">{data.summary.cyberRating.label}</div>
            <div className="hsc-sub" style={{ color: '#1A6BAA' }}>{data.summary.cyberRating.subtext}</div>
          </div>
        </div>
        <div className="home-summary-card" style={{ borderLeftColor: '#1A8A1A' }}>
          <span className="hsc-icon">📋</span>
          <div>
            <div className="hsc-val" style={{ color: '#1A8A1A' }}>{data.summary.sslCerts.value}</div>
            <div className="hsc-lbl">{data.summary.sslCerts.label}</div>
            <div className="hsc-sub" style={{ color: '#C0272D' }}>{data.summary.sslCerts.subtext}</div>
          </div>
        </div>
        <div className="home-summary-card" style={{ borderLeftColor: '#C0272D' }}>
          <span className="hsc-icon">⚠️</span>
          <div>
            <div className="hsc-val" style={{ color: '#C0272D' }}>{data.summary.cbomVulnerabilities.value}</div>
            <div className="hsc-lbl">{data.summary.cbomVulnerabilities.label}</div>
            <div className="hsc-sub" style={{ color: '#C0272D' }}>{data.summary.cbomVulnerabilities.subtext}</div>
          </div>
        </div>
      </div>
      <div className="home-detail-grid">
        <div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">📊</span>Assets Inventory</div>
            <div className="grid-2" style={{ gap: '10px', marginBottom: '10px' }}>
              <div className="stat-chip"><div className="sc-val">{data.inventory.ssl.toLocaleString()}</div><div className="sc-lbl">SSL Certificates</div></div>
              <div className="stat-chip"><div className="sc-val">{data.inventory.software.toLocaleString()}</div><div className="sc-lbl">Software</div></div>
              <div className="stat-chip info"><div className="sc-val">{data.inventory.iot.toLocaleString()}</div><div className="sc-lbl">IoT Devices</div></div>
              <div className="stat-chip warn"><div className="sc-val">{data.inventory.logins.toLocaleString()}</div><div className="sc-lbl">Login Forms</div></div>
            </div>
            <div style={{ height: '160px' }}>
              <div style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>[Inventory Chart Placeholder]</div>
            </div>
          </div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">🎯</span>Posture of PQC</div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>ML-KEM Adoption</span><span style={{ fontWeight: 700, color: 'var(--pnb-gold)' }}>{data.posture.mlKemAdoption}%</span></div>
              <div className="prog-bar"><div className="prog-fill pf-gold" style={{ width: `${data.posture.mlKemAdoption}%` }}></div></div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>ML-DSA Transition</span><span style={{ fontWeight: 700, color: 'var(--pnb-gold)' }}>{data.posture.mlDsaTransition}%</span></div>
              <div className="prog-bar"><div className="prog-fill pf-gold" style={{ width: `${data.posture.mlDsaTransition}%` }}></div></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span>Legacy Protocol Removal</span><span style={{ fontWeight: 700, color: '#C0272D' }}>{data.posture.legacyRemoval}%</span></div>
              <div className="prog-bar"><div className="prog-fill pf-red" style={{ width: `${data.posture.legacyRemoval}%` }}></div></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title"><span className="ct-icon">⭐</span>Cyber Rating Distribution</div>
            <div style={{ height: '180px' }}>
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
                <div style={{ marginBottom: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#C0272D', borderRadius: '2px', display: 'inline-block' }}></span>Critical: <b>{data.cbomSummary.critical.toLocaleString()}</b></div>
                <div style={{ marginBottom: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#E8A030', borderRadius: '2px', display: 'inline-block' }}></span>High: <b>{data.cbomSummary.high.toLocaleString()}</b></div>
                <div style={{ marginBottom: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#1A8A1A', borderRadius: '2px', display: 'inline-block' }}></span>Medium: <b>{data.cbomSummary.medium.toLocaleString()}</b></div>
                <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '12px', height: '12px', background: '#1A5ACC', borderRadius: '2px', display: 'inline-block' }}></span>Low: <b>{data.cbomSummary.low.toLocaleString()}</b></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
