import React, { useState, useEffect } from 'react';
import { getInventoryData } from '../api';
import { useScan } from '../context/ScanContext';

const Inventory = () => {
  const { activeScanId } = useScan();
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanning, setScanning] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getInventoryData();
      if (response.data.success) {
        setInventoryData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeScanId]);

  const handleDelete = async (purl) => {
    if (!window.confirm(`Are you sure you want to remove asset ${purl}?`)) return;
    try {
      const { deleteInventoryItem } = await import('../api');
      const res = await deleteInventoryItem(purl);
      if (res.data.success) {
        alert('Asset removed successfully.');
        fetchData();
      }
    } catch (err) {
      alert('Failed to delete asset. Please check server logs.');
    }
  };

  const handleView = (asset) => {
    setSelectedAsset(asset);
  };

  const handleScanAll = async () => {
    setScanning(true);
    try {
      const api = await import('../api');
      await api.runTriadScan({ target: 'Inventory Batch' });
      alert('Batch scan initiated for all inventory assets.');
    } catch (err) {
      alert('Scan service currently busy. Retry in 60s.');
    } finally {
      setScanning(false);
    }
  };

  const filteredData = inventoryData.filter(item => 
    (item.component || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.purl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.algorithm || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pnb-gold)', fontFamily: 'var(--mono)' }}>Loading Asset Inventory...</div>;
  }

  return (
    <div id="page-inventory" className="page-view">
      <div className="inv-stats">
        <div className="inv-stat">
          <div className="is-val">{inventoryData.length}</div>
          <div className="is-lbl">Total Assets</div>
        </div>
        <div className="inv-stat info">
          <div className="is-val">{inventoryData.filter(i => 
            (i.category || '').toLowerCase().includes('application') || 
            (i.component || '').toLowerCase().includes('web')
          ).length}</div>
          <div className="is-lbl">Web Pillar Assets</div>
        </div>
        <div className="inv-stat">
          <div className="is-val">{inventoryData.filter(i => 
            (i.category || '').toLowerCase().includes('library') || 
            (i.component || '').toLowerCase().includes('api')
          ).length}</div>
          <div className="is-lbl">API Pillar Assets</div>
        </div>
        <div className="inv-stat">
          <div className="is-val">{inventoryData.filter(i => !i.quantumSafe).length}</div>
          <div className="is-lbl">Quantum Vulnerable</div>
        </div>
        <div className="inv-stat warn">
          <div className="is-val">{inventoryData.filter(i => i.risk === 'High' || i.risk === 'Critical').length}</div>
          <div className="is-lbl">Elevated Risk Assets</div>
        </div>
        <div className="inv-stat danger">
          <div className="is-val">{inventoryData.filter(i => i.risk === 'Critical').length}</div>
          <div className="is-lbl">Critical Gap Analysis</div>
        </div>
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="card-title" style={{ margin: 0 }}>Asset Inventory</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-gold btn-sm" onClick={() => alert('Opening Add Asset Wizard...')}>+ Add Asset</button>
            <button className="btn btn-outline btn-sm" onClick={handleScanAll} disabled={scanning}>{scanning ? 'Scanning...' : 'Scan All ▶'}</button>
            <input 
               type="text" 
               placeholder="🔍 Search Inventory..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '20px', fontSize: '12px', outline: 'none', width: '180px' }} 
            />
          </div>
        </div>
        <div className="inv-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                 <th>Asset PURL / ID</th>
                <th>Component Name</th>
                <th>Category</th>
                <th>Version</th>
                <th>Algorithm</th>
                <th>Risk Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A5ACC' }}>{d.purl || `ASSET-${i+100}`}</td>
                  <td style={{ fontWeight: 'bold' }}>{d.component}</td>
                  <td><span style={{ fontSize: '11px', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>{d.category || 'Software'}</span></td>
                  <td>{d.version || 'v1.0'}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: d.algorithm?.includes('ML-') ? 'var(--pnb-gold)' : 'var(--pnb-red)' }}>{d.algorithm}</td>
                  <td><span className={`risk-badge ${d.risk === 'Low' ? 'rb-low' : (d.risk === 'Critical' ? 'rb-critical' : 'rb-high')}`}>{d.risk}</span></td>
                   <td style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px' }} onClick={() => handleView(d)}>View</button>
                    <button className="btn btn-red btn-sm" style={{ padding: '2px 8px' }} onClick={() => handleDelete(d.purl)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedAsset && (
        <div className="modal-overlay show" onClick={() => setSelectedAsset(null)}>
          <div className="modal-box" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <h3>Asset Details: {selectedAsset.component}</h3>
              <button className="modal-close" onClick={() => setSelectedAsset(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ fontSize: '12px' }}>
                   <b style={{ color: 'var(--pnb-red)' }}>COMPONENT:</b> {selectedAsset.component}
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                   <b style={{ color: '#333' }}>PURL:</b> {selectedAsset.purl}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="stat-chip" style={{ padding: '10px' }}>
                    <div className="sc-val" style={{ fontSize: '16px' }}>{selectedAsset.algorithm}</div>
                    <div className="sc-lbl">ALGORITHM</div>
                  </div>
                  <div className="stat-chip" style={{ padding: '10px' }}>
                    <div className={`sc-val ${selectedAsset.quantumSafe ? 'safe' : 'danger'}`} style={{ fontSize: '16px' }}>{selectedAsset.quantumSafe ? 'SAFE' : 'VULN'}</div>
                    <div className="sc-lbl">PQC STATUS</div>
                  </div>
                </div>

                {selectedAsset.server_banner && selectedAsset.server_banner !== 'Unknown' && (
                  <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', borderLeft: '3px solid var(--pnb-gold)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>SERVICE FINGERPRINT</div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Server: {selectedAsset.server_banner}</div>
                    {selectedAsset.security_audit && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        {['HSTS', 'CSP', 'X-Frame-Options'].map(h => (
                          <span key={h} style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '10px', background: selectedAsset.security_audit[h] ? '#e6f4ea' : '#fce8e6', color: selectedAsset.security_audit[h] ? '#1e7e34' : '#c5221f', border: '1px solid currentColor' }}>
                            {h}: {selectedAsset.security_audit[h] ? '✅' : '❌'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.6' }}>
                   This asset ({selectedAsset.category}) is currently part of the {selectedAsset.risk} risk profile. 
                   Migration to {selectedAsset.quantumSafe ? 'completed' : 'required (FIPS 203)'}.
                </p>
                <button className="btn btn-gold btn-sm" style={{ width: '100%' }} onClick={() => alert('Opening Full Audit Trace...')}>⚡ View Full Audit Trace</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
