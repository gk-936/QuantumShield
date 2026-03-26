import React, { useState, useEffect } from 'react';

const QDaySimulator = () => {
  const [progress, setProgress] = useState({ harvest: 0, qday: 0, decrypt: 0 });
  const [status, setStatus] = useState('Standby');

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
      }, 200);
      return () => clearInterval(timer);
    }
  }, [status]);

  return (
    <div id="page-qday" className="page-view">
      <div className="card">
        <div className="card-title">Harvest Now, Decrypt Later (HNDL) Threat Simulator</div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>This simulation visualizes the risk PNB faces today from data interception and future quantum decryption.</p>
        
        <div className="qday-phases">
          <div className="qday-phase qday-harvest" style={{ opacity: status === 'Standby' ? 0.3 : 1 }}>
            <div className="phase-tag">PHASE 01 — PRESENT DAY</div>
            <div className="phase-title">Data Harvesting (Eavesdropping)</div>
            <div className="phase-desc">Adversaries are intercepting and storing PNB's encrypted communications today, waiting for a cryptographically relevant quantum computer.</div>
            <div className="phase-prog-wrap"><div className="phase-prog-fill pp-harvest" style={{ width: `${progress.harvest}%` }}></div></div>
          </div>
          <div className="qday-phase qday-qday" style={{ opacity: status === 'Standby' ? 0.3 : 1 }}>
            <div className="phase-tag">PHASE 02 — THE "Q-DAY" EVENT</div>
            <div className="phase-title">Quantum Realization</div>
            <div className="phase-desc">Quantum hardware reaches sufficient qubits to run Shor's Algorithm against RSA/ECC keys in real-time.</div>
            <div className="phase-prog-wrap"><div className="phase-prog-fill pp-qday" style={{ width: `${progress.qday}%` }}></div></div>
          </div>
          <div className="qday-phase qday-decrypt" style={{ opacity: status === 'Standby' ? 0.3 : 1 }}>
            <div className="phase-tag">PHASE 03 — POST-QUANTUM ERA</div>
            <div className="phase-title">Retroactive Decryption</div>
            <div className="phase-desc">Stored historical data is decrypted instantly. Trade secrets, customer PII, and financial records from 2024-2026 are exposed.</div>
            <div className="phase-prog-wrap"><div className="phase-prog-fill pp-decrypt" style={{ width: `${progress.decrypt}%` }}></div></div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-red" onClick={startSimulation} disabled={status === 'Active'}>
            {status === 'Active' ? 'SIMULATING ATTACK...' : 'RUN HNDL ATTACK SIMULATION'}
          </button>
          <div style={{ marginTop: '14px', fontFamily: 'var(--mono)', fontSize: '13px', color: status === 'Active' ? '#C0272D' : '#888' }}>
            STATUS: {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QDaySimulator;
