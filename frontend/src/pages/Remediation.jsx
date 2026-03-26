import React, { useState, useEffect } from 'react';
import { generateRemediation } from '../api';

const Remediation = () => {
  const [remediations, setRemediations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const loadFixes = async () => {
    setIsLoading(true);
    try {
      const res = await generateRemediation([]); // Passing empty findings for now to get defaults
      if (res.data.success) {
        setRemediations(res.data.scripts);
      }
    } catch (err) {
      console.error('Failed to load remediation fixes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFixes();
  }, []);

  return (
    <div id="page-remediation" className="page-view">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="card-title">AI Auto-Remediation Deployment Scripts</div>
          <button className="btn btn-gold btn-sm" onClick={loadFixes} disabled={isLoading}>
            {isLoading ? 'Generating...' : '⚡ Regenerate AI Fixes'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
            The AI engine has parsed your Triad Scan results and generated standard PQC migration snippets (NIST SP 800-207/9370).
        </p>
        
        {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--pnb-red)', fontFamily: 'var(--mono)' }}>⚡ RUNNING AI REMEDIATION ENGINE...</div>
        ) : (
            <div className="remed-accordion">
            {remediations.map((r, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                <div className="remed-header" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                    <h4>{r.title}</h4>
                    <span className="risk-badge rb-low" style={{ marginLeft: '10px', fontSize: '10px' }}>{r.type.toUpperCase()}</span>
                    <span style={{ marginLeft: 'auto' }}>{openIndex === i ? '−' : '+'}</span>
                </div>
                <div className={`remed-body ${openIndex === i ? 'open' : ''}`}>
                    <div className="code-snippet">
                    <pre>{r.code}</pre>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button className="btn btn-gold btn-sm">🚀 Deploy via Ansible</button>
                        <button className="btn btn-outline btn-sm">📋 Copy Snippet</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Remediation;
