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
          
          // PQC Sensitivity Model:
          // Base Q-Day: 2029 (3 years away)
          // Adjust based on specific risk posture
          const postureScore = res.data.data.posture.quantumRisk || 85;
          const calculatedTte = (12 - (postureScore / 10) - (count / 5000)).toFixed(1);
          setTte(Math.max(2.1, calculatedTte));
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
    <div id="page-qday" className="page-view" style={{ background: '#050510', borderRadius: '12px', padding: '20px' }}>
      <div className="card" style={{ background: 'rgba(10, 10, 30, 0.8)', border: '1px solid #C0272D', boxShadow: '0 0 40px rgba(192, 39, 45, 0.2)' }}>
        <div className="card-title" style={{ color: '#FF4444', textShadow: '0 0 10px rgba(255,68,68,0.5)' }}>☢️ HNDL Threat Simulator & Exposure Model</div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="stat-chip danger" style={{ flex: 1, background: 'rgba(192, 39, 45, 0.1)', border: '1px solid #C0272D' }}>
                <div className="sc-val" style={{ color: '#FF4444' }}>{tte || 'Calculating...'} Years</div>
                <div className="sc-lbl" style={{ color: 'rgba(255,255,255,0.7)' }}>Est. Time to Exposure (TTE)</div>
            </div>
            <div className="stat-chip info" style={{ flex: 1, background: 'rgba(26, 107, 170, 0.1)', border: '1px solid #1A6BAA' }}>
                <div className="sc-val" style={{ color: '#4A90D9' }}>{vulnCount.toLocaleString()}</div>
                <div className="sc-lbl" style={{ color: 'rgba(255,255,255,0.7)' }}>Vulnerable Data Points</div>
            </div>
        </div>
        <p style={{ fontSize: '13px', color: '#AAA', marginBottom: '20px', lineHeight: '1.6' }}>
            PNB's current "Cyber Posture" suggests a <b style={{ color: '#FF4444' }}>Harvest-Now-Decrypt-Later</b> exposure horizon of <b style={{ color: '#FF4444' }}>{tte} years</b>. 
            Cryptographic assets identified in the inventory are being stored by adversaries for retroactive decryption once a CRQC is realized.
        </p>
        
        <div className="qday-phases">
          <div className="qday-phase" style={{ 
            opacity: status === 'Standby' ? 0.3 : 1, 
            background: 'linear-gradient(90deg, #1A1A1A, #2A2A2A)',
            borderLeft: '4px solid #FFA500',
            marginBottom: '15px',
            padding: '20px'
          }}>
            <div className="phase-tag" style={{ color: '#FFA500' }}>PHASE 01 — PRESENT DAY</div>
            <div className="phase-title" style={{ color: '#FFF' }}>Data Harvesting (Eavesdropping)</div>
            <div className="phase-desc" style={{ color: '#888' }}>Intercepting and storing {vulnCount.toLocaleString()} RSA/ECC encrypted sessions.</div>
            <div className="phase-prog-wrap" style={{ height: '6px', background: '#333', marginTop: '10px' }}><div className="phase-prog-fill" style={{ width: `${progress.harvest}%`, height: '100%', background: '#FFA500', boxShadow: '0 0 10px #FFA500' }}></div></div>
          </div>
          <div className="qday-phase" style={{ 
            opacity: status === 'Standby' ? 0.3 : 1, 
            background: 'linear-gradient(90deg, #1A1A1A, #2A2A2A)',
            borderLeft: '4px solid #FF4444',
            marginBottom: '15px',
            padding: '20px'
          }}>
            <div className="phase-tag" style={{ color: '#FF4444' }}>PHASE 02 — THE "Q-DAY" EVENT</div>
            <div className="phase-title" style={{ color: '#FFF' }}>Quantum Realization (CRQC)</div>
            <div className="phase-desc" style={{ color: '#888' }}>Quantum hardware achieves ~20M physical qubits (Shor's Algorithm execution).</div>
            <div className="phase-prog-wrap" style={{ height: '6px', background: '#333', marginTop: '10px' }}><div className="phase-prog-fill" style={{ width: `${progress.qday}%`, height: '100%', background: '#FF4444', boxShadow: '0 0 15px #FF4444' }}></div></div>
          </div>
          <div className="qday-phase" style={{ 
            opacity: status === 'Standby' ? 0.3 : 1, 
            background: 'linear-gradient(90deg, #1A1A1A, #2A2A2A)',
            borderLeft: '4px solid #CC44CC',
            padding: '20px'
          }}>
            <div className="phase-tag" style={{ color: '#CC44CC' }}>PHASE 03 — POST-QUANTUM ERA</div>
            <div className="phase-title" style={{ color: '#FFF' }}>Retroactive Decryption</div>
            <div className="phase-desc" style={{ color: '#888' }}>Historical banking records, PII, and trade secrets are exposed in approximately 0.4 seconds per key.</div>
            <div className="phase-prog-wrap" style={{ height: '6px', background: '#333', marginTop: '10px' }}><div className="phase-prog-fill" style={{ width: `${progress.decrypt}%`, height: '100%', background: '#CC44CC', boxShadow: '0 0 15px #CC44CC' }}></div></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button className="btn btn-red" onClick={startSimulation} disabled={status === 'Active'} style={{ padding: '15px 40px', fontSize: '16px', boxShadow: '0 0 30px rgba(192,39,45,0.4)' }}>
            {status === 'Active' ? '☣️ SIMULATING ATTACK...' : '💥 RUN HNDL ATTACK SIMULATION'}
          </button>
          <div style={{ marginTop: '20px', fontFamily: 'var(--mono)', fontSize: '14px', color: status === 'Active' ? '#FF4444' : (status.includes('Complete') ? '#00FF88' : '#666'), letterSpacing: '2px' }}>
            SYSTEM-STATUS: {status.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QDaySimulator;
