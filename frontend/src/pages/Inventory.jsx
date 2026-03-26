import React from 'react';

const Inventory = () => {
  const inventoryData = [
    { name: 'portal.company.com', url: 'https://portal.company.com', ipv4: '34.12.11.45', ipv6: '2001:0db8:85a3:8a2e:0370:7334', type: 'Web App', owner: 'IT', risk: 'High', cert: 'Valid', key: '2048-bit', scan: '2 hrs ago' },
    { name: 'api.company.com', url: 'https://api.company.com', ipv4: '34.12.11.90', ipv6: '2001:0db8:85a3:8a2e:0430:1111', type: 'API', owner: 'DevOps', risk: 'Medium', cert: 'Expiring', key: '4096-bit', scan: '5 hrs ago' },
    { name: 'vpn.company.com', url: 'https://vpn.company.com', ipv4: '34.55.90.21', ipv6: '2001:0db8:85a3:8a2e:0990:abcd', type: 'Gateway', owner: 'Infra', risk: 'Critical', cert: 'Expired', key: '1024-bit', scan: '1 hr ago' },
    { name: 'mail.company.com', url: 'https://mail.company.com', ipv4: '35.11.44.10', ipv6: '2001:0db8:85a3:82a:0a10:ff21', type: 'Server', owner: 'IT', risk: 'Low', cert: 'Valid', key: '3072-bit', scan: '1 day ago' },
    { name: 'app.company.com', url: 'https://app.company.com', ipv4: '34.77.21.12', ipv6: '2001:0db8:85a3:82a:0b30:8344', type: 'Web App', owner: 'IT', risk: 'Medium', cert: 'Valid', key: '2048-bit', scan: '5 days ago' },
  ];

  return (
    <div id="page-inventory" className="page-view">
      <div className="inv-stats">
        <div className="inv-stat"><div className="is-val">128</div><div className="is-lbl">Total Assets</div></div>
        <div className="inv-stat info"><div className="is-val" style={{ color: '#1A5ACC' }}>42</div><div className="is-lbl">Public Web Apps</div></div>
        <div className="inv-stat"><div className="is-val" style={{ color: '#1A7A3A' }}>26</div><div className="is-lbl">APIs</div></div>
        <div className="inv-stat"><div className="is-val" style={{ color: '#5A3A8A' }}>37</div><div className="is-lbl">Servers</div></div>
        <div className="inv-stat warn"><div className="is-val">9</div><div className="is-lbl">Expiring Certs</div></div>
        <div className="inv-stat danger"><div className="is-val">14</div><div className="is-lbl">High Risk</div></div>
      </div>
      <div className="inv-charts">
        <div className="card" style={{ margin: 0 }}><div className="card-title" style={{ fontSize: '13px' }}>Asset Type Distribution</div><div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div></div>
        <div className="card" style={{ margin: 0 }}><div className="card-title" style={{ fontSize: '13px' }}>Asset Risk Distribution</div><div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div></div>
        <div className="card" style={{ margin: 0 }}><div className="card-title" style={{ fontSize: '13px' }}>Certificate Expiry Timeline</div><div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div></div>
        <div className="card" style={{ margin: 0 }}><div className="card-title" style={{ fontSize: '13px' }}>IP Version Breakdown</div><div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>[Chart]</div></div>
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
                <th>Asset Name</th>
                <th>URL</th>
                <th>IPv4 Address</th>
                <th>IPv6 Address</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Risk</th>
                <th>Cert Status</th>
                <th>Key Length</th>
                <th>Last Scan</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((d, i) => (
                <tr key={i}>
                  <td><input type="checkbox" /></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#1A5ACC' }}>{d.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A5ACC' }}><a href="#" style={{ color: '#1A5ACC', textDecoration: 'none' }}>{d.url}</a></td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>{d.ipv4}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#888' }}>{d.ipv6}</td>
                  <td>{d.type}</td>
                  <td>{d.owner}</td>
                  <td><span className={`risk-badge rb-${d.risk.toLowerCase()}`}>{d.risk}</span></td>
                  <td className={d.cert === 'Valid' ? 'cert-ok' : d.cert === 'Expiring' ? 'cert-warn' : 'cert-err'}>
                    {d.cert === 'Valid' ? '✓' : d.cert === 'Expiring' ? '⚠' : '✗'} {d.cert}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--pnb-red)' }}>{d.key}</td>
                  <td style={{ color: 'var(--text-dim)' }}>{d.scan}</td>
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
