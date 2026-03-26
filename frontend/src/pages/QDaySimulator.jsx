import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../api';

const QDaySimulator = () => {
  const [progress, setProgress] = useState({ harvest: 0, qday: 0, decrypt: 0 });
  const [status, setStatus] = useState('Standby');
  const [tte, setTte] = useState(null); // Time To Exposure (years)
  const [vulnCount, setVulnCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardData();
        if (res.data.success) {
          const count = parseInt(res.data.data.summary.cbomVulnerabilities.value.replace(/,/g, ''));
          setVulnCount(count);
          // Simple model: More vulnerabilities = Stored data is more valuable/easier targets
          // Average Q-Day prediction 2029-2032 (5-8 years)
          setTte(Math.max(3.2, 8.5 - (count / 2000)).toFixed(1));
        }
      } catch (e) {
        setTte(7.5);
      }
    };
    fetchStats();
  }, []);

  const startSimulation = () => {
    setStatus('Active');
    setProgress({ harvest: 0, qday: 0, decrypt: 0 });
  };

  useEffect(() => {
    if (status === 'Active') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev.harvest < 100) return { ...prev, harvest: prev.harvest + 5 };
          if (prev.qday < 100) return { ...prev, qday: prev.qday + 2 };
          if (prev.decrypt < 100) return { ...prev, decrypt: prev.decrypt + 10 };
          clearInterval(timer);
          setStatus('Simulated Breach Complete');
          return prev;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [status]);

  return (
    <div id="page-qday" className="page-view">
      <div className="card">
        <div className="card-title">HNDL Threat Simulator & Exposure Model</div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="stat-chip danger" style={{ flex: 1 }}>
                <div className="sc-val">{tte || 'Calculating...'} Years</div>
                <div className="sc-lbl">Est. Time to Exposure (TTE)</div>
            </div>
            <div className="stat-chip info" style={{ flex: 1 }}>
                <div className="sc-val">{vulnCount.toLocaleString()}</div>
                <div className="sc-lbl">Vulnerable Data Points</div>
            </div>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
            PNB's current "Cyber Posture" suggests a <b>Harvest-Now-Decrypt-Later</b> exposure horizon of <b>{tte} years</b>. 
            Cryptographic assets identified in the inventory are being stored by adversaries for retroactive decryption once a CRQC (Cryptographically Relevant Quantum Computer) is realized.
        </p>
        
        <div className="qday-phases">
          <div className="qday-phase qday-harvest" style={{ opacity: status === 'Standby' ? 0.3 : 1 }}>
            <div className="phase-tag">PHASE 01 — PRESENT DAY</div>
            <div className="phase-title">Data Harvesting (Eavesdropping)</div>
            <div className="phase-desc">Intercepting and storing {vulnCount.toLocaleString()} RSA/ECC encrypted sessions.</div>
            <div className="phase-prog-wrap"><div className="phase-prog-fill pp-harvest" style={{ width: `${progress.harvest}%` }}></div></div>
          </div>
          <div className="qday-phase qday-qday" style={{ opacity: status === 'Standby' ? 0.3 : 1 }}>
            <div className="phase-tag">PHASE 02 — THE "Q-DAY" EVENT</div>
            <div className="phase-title">Quantum Realization (CRQC)</div>
            <div className="phase-desc">Quantum hardware achieves ~20M physical qubits (Shor's Algorithm execution).</div>
            <div className="phase-prog-wrap"><div className="phase-prog-fill pp-qday" style={{ width: `${progress.qday}%` }}></div></div>
          </div>
          <div className="qday-phase qday-decrypt" style={{ opacity: status === 'Standby' ? 0.3 : 1 }}>
            <div className="phase-tag">PHASE 03 — POST-QUANTUM ERA</div>
            <div className="phase-title">Retroactive Decryption</div>
            <div className="phase-desc">Historical banking records, PII, and trade secrets are exposed in approximately 0.4 seconds per key.</div>
            <div className="phase-prog-wrap"><div className="phase-prog-fill pp-decrypt" style={{ width: `${progress.decrypt}%` }}></div></div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-red" onClick={startSimulation} disabled={status === 'Active'}>
            {status === 'Active' ? 'SIMULATING ATTACK...' : 'RUN HNDL ATTACK SIMULATION'}
          </button>
          <div style={{ marginTop: '14px', fontFamily: 'var(--mono)', fontSize: '13px', color: status === 'Active' ? '#C0272D' : (status.includes('Complete') ? 'var(--pnb-gold)' : '#888') }}>
            STATUS: {status.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QDaySimulator;
