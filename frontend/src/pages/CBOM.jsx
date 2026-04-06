import React, { useState, useEffect } from 'react';
import { getCbomData } from '../api';
import { useScan } from '../context/ScanContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CBOM = () => {
  const { activeScanId } = useScan();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, [activeScanId]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pnb-gold)', fontFamily: 'var(--mono)' }}>Loading CBOM Data...</div>;
  }

  return (
    <div id="page-cbom" className="page-view" style={{ background: '#F8FAFC' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#111' }}>Cryptographic Bill of Materials (CBOM)</h2>
        <div style={{ padding: '8px 16px', background: '#1A8A1A22', color: '#1A8A1A', borderRadius: '30px', fontWeight: 700, fontSize: '13px' }}>
          🛡️ CycloneDX 1.5 Compliant
        </div>
      </div>

      <div className="cbom-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div className="card" style={{ margin: 0, textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 800 }}>{items.length}</div><div style={{ fontSize: '11px', opacity: 0.6 }}>Total Components</div></div>
        <div className="card" style={{ margin: 0, textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 800, color: '#1A8A1A' }}>{items.filter(i => i.quantumSafe).length}</div><div style={{ fontSize: '11px', opacity: 0.6 }}>Quantum Safe</div></div>
        <div className="card" style={{ margin: 0, textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 800, color: '#C0272D' }}>{items.filter(i => !i.quantumSafe).length}</div><div style={{ fontSize: '11px', opacity: 0.6 }}>Vulnerable</div></div>
        <div className="card" style={{ margin: 0, textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 800 }}>9</div><div style={{ fontSize: '11px', opacity: 0.6 }}>Expiring 30d</div></div>
        <div className="card" style={{ margin: 0, textAlign: 'center' }}><div style={{ fontSize: '24px', fontWeight: 800, color: '#D47800' }}>3</div><div style={{ fontSize: '11px', opacity: 0.6 }}>Critical Vulns</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px', marginBottom: '25px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-title" style={{ fontSize: '14px', marginBottom: '20px' }}>🛡️ Algorithm Inventory Pulse</div>
          <div style={{ height: '260px' }}>
            <Bar 
              data={{
                labels: ['ML-KEM-768', 'ML-DSA-65', 'RSA-4096', 'ECC-P384', 'AES-256-GCM'],
                datasets: [{
                  label: 'Deployments',
                  data: [12, 8, 45, 32, 89],
                  backgroundColor: ['#C8860A', '#C8860A', '#C0272D', '#D47800', '#1A8A1A'],
                  borderRadius: 5
                }]
              }} 
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#f0f0f0' } } } }} 
            />
          </div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-title" style={{ fontSize: '14px', marginBottom: '20px' }}>⚠️ PQC Readiness Distribution</div>
          <div style={{ height: '260px' }}>
            <Doughnut 
              data={{
                labels: ['NIST FIPS 203 (ML-KEM)', 'NIST FIPS 204 (ML-DSA)', 'Legacy Classical'],
                datasets: [{
                  data: [35, 25, 40],
                  backgroundColor: ['#C8860A', '#1A8A1A', '#C0272D'],
                  borderWidth: 0
                }]
              }} 
              options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } } }} 
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Cryptographic Asset Ledger (PNB Core Infra)</div>
        <div className="inv-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Category</th>
                <th>Version</th>
                <th>Algorithm</th>
                <th>Safety</th>
                <th>Risk Profile</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: '#1A5ACC' }}>{item.component}</td>
                  <td><span style={{ fontSize: '10px', background: '#eee', padding: '2px 8px', borderRadius: '4px' }}>{item.category}</span></td>
                  <td>{item.version}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{item.algorithm}</td>
                  <td>{item.quantumSafe ? <span className="pqc-yes">✅ READY</span> : <span className="pqc-no">❌ LEGACY</span>}</td>
                  <td>
                    <span className={`risk-badge ${item.risk === 'Critical' ? 'rb-critical' : (item.risk === 'High' ? 'rb-high' : 'rb-low')}`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            className="btn btn-gold" 
            style={{ padding: '12px 30px', fontWeight: 700 }}
            onClick={() => window.open('/api/data/cbom/export/json', '_blank')}
          >
            📥 Export CycloneDX v1.5 JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default CBOM;
