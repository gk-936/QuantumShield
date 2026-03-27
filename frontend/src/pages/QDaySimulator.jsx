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
    <div id="page-qday" className="page-view">
      <div className="card" style={{ borderTop: '4px solid #C0272D' }}>
        <div className="card-title" style={{ color: '#C0272D', marginBottom: '24px' }}>☢️ HNDL Threat Simulator & Exposure Model</div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div className="stat-chip danger" style={{ flex: 1, minWidth: '200px' }}>
                <div className="sc-val" style={{ color: '#C0272D' }}>{tte || 'Calculating...'} Years</div>
                <div className="sc-lbl">Est. Time to Exposure (TTE)</div>
            </div>
            <div className="stat-chip info" style={{ flex: 1, minWidth: '200px' }}>
                <div className="sc-val" style={{ color: '#1A6BAA' }}>{vulnCount.toLocaleString()}</div>
                <div className="sc-lbl">Vulnerable Data Points</div>
            </div>
        </div>
        <p style={{ fontSize: '14px', color: '#7A5A30', marginBottom: '30px', lineHeight: '1.8', background: '#FFF3D4', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #C0272D' }}>
            PNB's current "Cyber Posture" suggests a <b style={{ color: '#C0272D' }}>Harvest-Now-Decrypt-Later</b> exposure horizon of <b style={{ color: '#C0272D' }}>{tte} years</b>. 
            Cryptographic assets identified in the inventory are being stored by adversaries for retroactive decryption once a CRQC is realized.
        </p>
        
        <div className="qday-phases">
          <div className="qday-phase" style={{ 
            opacity: status === 'Standby' ? 0.6 : 1, 
            background: '#FFF8E7',
            borderLeft: '5px solid #C8860A',
            marginBottom: '16px',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #FAECD4',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(100,30,0,0.08)'
          }}>
            <div className="phase-tag" style={{ color: '#C8860A', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>PHASE 01 — PRESENT DAY</div>
            <div className="phase-title" style={{ color: '#2C1A00', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>📊 Data Harvesting (Eavesdropping)</div>
            <div className="phase-desc" style={{ color: '#7A5A30', marginBottom: '12px', fontSize: '13px' }}>Intercepting and storing {vulnCount.toLocaleString()} RSA/ECC encrypted sessions.</div>
            <div className="phase-prog-wrap" style={{ height: '6px', background: '#E8D9C4', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}><div className="phase-prog-fill" style={{ width: `${progress.harvest}%`, height: '100%', background: '#C8860A', boxShadow: '0 0 8px rgba(200,134,10,0.4)', transition: 'width 0.2s ease' }}></div></div>
            <div style={{ fontSize: '11px', color: '#C8860A', marginTop: '8px', textAlign: 'right', fontWeight: '600' }}>{progress.harvest}%</div>
          </div>
          <div className="qday-phase" style={{ 
            opacity: status === 'Standby' ? 0.6 : 1, 
            background: '#FFF3F3',
            borderLeft: '5px solid #C0272D',
            marginBottom: '16px',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #F5D9DB',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(192,39,45,0.08)'
          }}>
            <div className="phase-tag" style={{ color: '#C0272D', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>PHASE 02 — THE "Q-DAY" EVENT</div>
            <div className="phase-title" style={{ color: '#2C1A00', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>⚡ Quantum Realization (CRQC)</div>
            <div className="phase-desc" style={{ color: '#7A5A30', marginBottom: '12px', fontSize: '13px' }}>Quantum hardware achieves ~20M physical qubits (Shor's Algorithm execution).</div>
            <div className="phase-prog-wrap" style={{ height: '6px', background: '#EDD5D7', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}><div className="phase-prog-fill" style={{ width: `${progress.qday}%`, height: '100%', background: '#C0272D', boxShadow: '0 0 8px rgba(192,39,45,0.4)', transition: 'width 0.2s ease' }}></div></div>
            <div style={{ fontSize: '11px', color: '#C0272D', marginTop: '8px', textAlign: 'right', fontWeight: '600' }}>{progress.qday}%</div>
          </div>
          <div className="qday-phase" style={{ 
            opacity: status === 'Standby' ? 0.6 : 1, 
            background: '#F5F3FA',
            borderLeft: '5px solid #6B4D9C',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #E8DFF3',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(107,77,156,0.08)'
          }}>
            <div className="phase-tag" style={{ color: '#6B4D9C', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>PHASE 03 — POST-QUANTUM ERA</div>
            <div className="phase-title" style={{ color: '#2C1A00', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>🔓 Retroactive Decryption</div>
            <div className="phase-desc" style={{ color: '#7A5A30', marginBottom: '12px', fontSize: '13px' }}>Historical banking records, PII, and trade secrets are exposed in approximately 0.4 seconds per key.</div>
            <div className="phase-prog-wrap" style={{ height: '6px', background: '#E4DCED', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}><div className="phase-prog-fill" style={{ width: `${progress.decrypt}%`, height: '100%', background: '#6B4D9C', boxShadow: '0 0 8px rgba(107,77,156,0.4)', transition: 'width 0.2s ease' }}></div></div>
            <div style={{ fontSize: '11px', color: '#6B4D9C', marginTop: '8px', textAlign: 'right', fontWeight: '600' }}>{progress.decrypt}%</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '35px' }}>
          <button className="btn btn-red" onClick={startSimulation} disabled={status === 'Active'} style={{ padding: '13px 40px', fontSize: '14px', fontWeight: '600', letterSpacing: '1px', opacity: status === 'Active' ? 0.6 : 1, cursor: status === 'Active' ? 'not-allowed' : 'pointer' }}>
            {status === 'Active' ? '☣️ SIMULATING ATTACK...' : '💥 RUN HNDL ATTACK SIMULATION'}
          </button>
          <div style={{ marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '12px', color: status === 'Active' ? '#C0272D' : (status.includes('Complete') ? '#1A8A1A' : '#7A5A30'), letterSpacing: '2px', fontWeight: '600', textTransform: 'uppercase' }}>
            ⚙️ {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QDaySimulator;
