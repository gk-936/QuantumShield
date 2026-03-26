import React, { useState, useEffect } from 'react';
import { getInventoryData } from '../api';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInventoryData();
        if (response.data.success) {
          setInventoryData(response.data.data.inventory);
        }
      } catch (err) {
        console.error('Failed to fetch inventory data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pnb-gold)', fontFamily: 'var(--mono)' }}>Loading Asset Inventory...</div>;
  }

  return (
    <div id="page-inventory" className="page-view">
      <div className="inv-stats">
        <div className="inv-stat"><div className="is-val">{inventoryData.length}</div><div className="is-lbl">Total Assets</div></div>
        <div className="inv-stat info"><div className="is-val" style={{ color: '#1A5ACC' }}>42</div><div className="is-lbl">Public Web Apps</div></div>
        <div className="inv-stat"><div className="is-val" style={{ color: '#1A7A3A' }}>26</div><div className="is-lbl">APIs</div></div>
        <div className="inv-stat"><div className="is-val" style={{ color: '#5A3A8A' }}>37</div><div className="is-lbl">Servers</div></div>
        <div className="inv-stat warn"><div className="is-val">9</div><div className="is-lbl">Expiring Certs</div></div>
        <div className="inv-stat danger"><div className="is-val">14</div><div className="is-lbl">High Risk</div></div>
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="card-title" style={{ margin: 0 }}>Asset Inventory</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-gold btn-sm">+ Add Asset</button>
            <button className="btn btn-outline btn-sm">Scan All ▶</button>
            <input type="text" placeholder="🔍 Search..." style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '20px', fontSize: '12px', outline: 'none', width: '160px' }} />
          </div>
        </div>
        <div className="inv-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Protocol</th>
                <th>Algorithm</th>
                <th>Status</th>
                <th># Vuln.</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((d, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#1A5ACC' }}>{d.id}</td>
                  <td style={{ fontWeight: 'bold' }}>{d.name}</td>
                  <td>{d.type}</td>
                  <td>{d.protocol}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: d.algorithm.includes('ML-') ? 'var(--pnb-gold)' : 'var(--pnb-red)' }}>{d.algorithm}</td>
                  <td><span className={`risk-badge ${d.status === 'PQC Ready' ? 'rb-low' : (d.status === 'Critical' ? 'rb-critical' : 'rb-high')}`}>{d.status}</span></td>
                  <td>{d.vulnCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
