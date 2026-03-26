import React, { useState, useEffect } from 'react';
import { getCbomData } from '../api';

const CBOM = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCbomData();
        if (response.data.success) {
          setItems(response.data.data.cbomItems);
        }
      } catch (err) {
        console.error('Failed to fetch CBOM data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pnb-gold)', fontFamily: 'var(--mono)' }}>Loading CBOM Data...</div>;
  }

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
          <thead>
            <tr>
              <th>Component</th>
              <th>Version</th>
              <th>Algorithm</th>
              <th>PURL</th>
              <th>Quantum Safe</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td><b>{item.component}</b></td>
                <td>{item.version}</td>
                <td style={{ fontFamily: 'var(--mono)', color: item.quantumSafe ? 'var(--pnb-gold)' : 'var(--pnb-red)' }}>{item.algorithm}</td>
                <td style={{ fontSize: '10px', color: '#666' }}>{item.purl}</td>
                <td>
                  <span className={`risk-badge ${item.quantumSafe ? 'rb-low' : 'rb-high'}`}>
                    {item.quantumSafe ? 'YES' : 'NO'}
                  </span>
                </td>
                <td>{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <button 
            className="btn btn-gold" 
            onClick={() => window.open('http://localhost:5006/api/data/cbom/download', '_blank')}
          >
            📥 Download CycloneDX CBOM (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CBOM;
