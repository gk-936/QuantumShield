import React, { useState } from 'react';
import { sendEmailReport } from '../api';

const Reporting = () => {
  const [reportType, setReportType] = useState('executive');
  const [isScheduled, setIsScheduled] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const response = await sendEmailReport({ email, reportType });
      if (response.data.success) {
        if (response.data.simulated) {
          alert(`[SIMULATION MODE] The report for ${email} has been generated and logged to the server console. To send real emails, please configure SMTP credentials in the backend .env file.`);
        } else {
          alert(`Success! The ${reportType.toUpperCase()} report has been dispatched to ${email}.`);
        }
      } else {
        alert(response.data.message || 'Failed to send report. Check SMTP configuration.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending report.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="page-reporting" className="page-view" style={{ background: '#F4F7F9' }}>
      <div style={{ background: '#fff', borderBottom: '3px solid var(--pnb-red)', padding: '20px 40px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontFamily: 'var(--disp)', fontSize: '24px', color: 'var(--pnb-red)', margin: 0 }}>OFFICIAL PQC COMPLIANCE & AUDIT REPORTING</h1>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Pursuant to NIST SP 800-215 and CERT-In Cyber Security Guidelines.</p>
      </div>

      <div className="report-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '0 20px' }}>
        <div className={`report-card ${reportType === 'executive' ? 'active' : ''}`} 
             style={{ background: '#fff', border: reportType === 'executive' ? '2px solid var(--pnb-gold)' : '1px solid #ddd', padding: '24px', borderRadius: '12px', cursor: 'pointer' }}
             onClick={() => setReportType('executive')}>
          <div className="rc-icon" style={{ fontSize: '32px', marginBottom: '12px' }}>🏢</div>
          <div className="rc-title" style={{ fontWeight: 700, fontSize: '16px', color: '#333' }}>Executive Summary</div>
          <div className="rc-desc" style={{ fontSize: '12px', color: '#777', marginTop: '8px' }}>High-level risk posture and PQC readiness score mapped to PNB internal KPIs.</div>
        </div>
        <div className={`report-card ${reportType === 'technical' ? 'active' : ''}`} 
             style={{ background: '#fff', border: reportType === 'technical' ? '2px solid var(--pnb-gold)' : '1px solid #ddd', padding: '24px', borderRadius: '12px', cursor: 'pointer' }}
             onClick={() => setReportType('technical')}>
          <div className="rc-icon" style={{ fontSize: '32px', marginBottom: '12px' }}>🛠️</div>
          <div className="rc-title" style={{ fontWeight: 700, fontSize: '16px', color: '#333' }}>Technical CBOM</div>
          <div className="rc-desc" style={{ fontSize: '12px', color: '#777', marginTop: '8px' }}>Detailed cryptographic inventory (CycloneDX) and per-asset OID analysis.</div>
        </div>
        <div className={`report-card ${reportType === 'compliance' ? 'active' : ''}`} 
             style={{ background: '#fff', border: reportType === 'compliance' ? '2px solid var(--pnb-gold)' : '1px solid #ddd', padding: '24px', borderRadius: '12px', cursor: 'pointer' }}
             onClick={() => setReportType('compliance')}>
          <div className="rc-icon" style={{ fontSize: '32px', marginBottom: '12px' }}>⚖️</div>
          <div className="rc-title" style={{ fontWeight: 700, fontSize: '16px', color: '#333' }}>Compliance Audit</div>
          <div className="rc-desc" style={{ fontSize: '12px', color: '#777', marginTop: '8px' }}>Formal gap analysis against NIST FIPS 203/204 and Annexure-A standards.</div>
        </div>
      </div>

      <div className="card report-form-area" style={{ margin: '30px 20px', background: '#fff', border: '1px solid #eee' }}>
        <div className="card-title" style={{ fontSize: '18px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>Report Configuration & Automated Schedulers</div>
        <div className="sched-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
          <div>
            <div className="form-group">
              <label className="form-label" style={{ color: '#1A5ACC', fontWeight: 700 }}>1. CHOOSE OUTPUT FORMATS</label>
              <div className="checkbox-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <label className="checkbox-item"><input type="checkbox" defaultChecked /> PDF (Standard)</label>
                <label className="checkbox-item"><input type="checkbox" /> Excel (.xlsx)</label>
                <label className="checkbox-item"><input type="checkbox" /> JSON (CycloneDX)</label>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label" style={{ color: '#1A5ACC', fontWeight: 700 }}>2. DELIVERY AUTOMATION</label>
              <div className="delivery-row" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                <div className={`toggle-sw ${isScheduled ? 'on' : ''}`} 
                     onClick={() => setIsScheduled(!isScheduled)}
                     style={{ width: '50px', height: '26px', background: isScheduled ? 'var(--pnb-gold)' : '#ccc', borderRadius: '13px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', left: isScheduled ? '26px' : '4px', top: '4px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'all 0.2s' }}></div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Enable Periodic Scanning & Logging</div>
              </div>
            </div>
          </div>
          <div style={{ opacity: isScheduled ? 1 : 0.5, pointerEvents: isScheduled ? 'auto' : 'none', borderLeft: '1px solid #eee', paddingLeft: '40px' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#1A5ACC', fontWeight: 700 }}>3. SCHEDULE DENSITY</label>
              <select className="form-select" style={{ marginTop: '10px', width: '100%', padding: '12px' }}>
                <option>Daily Audit (24-hour cycle)</option>
                <option>Weekly Compliance Pulse (Monday 04:00)</option>
                <option>Monthly Board Report (1st 08:00)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
          <label className="form-label" style={{ color: '#1A5ACC', fontWeight: 700 }}>4. ONE-TIME DISPATCH (EMAIL)</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Enter auditor/admin email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, padding: '12px' }}
            />
            <button 
              className="btn btn-gold" 
              style={{ padding: '12px 30px', whiteSpace: 'nowrap' }} 
              onClick={handleSendEmail}
              disabled={sending}
            >
              {sending ? '📤 SENDING...' : '📧 SEND TO EMAIL'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px', display: 'flex', gap: '15px' }}>
          <button className="btn btn-gold" style={{ padding: '12px 30px' }} onClick={() => alert('Generating Official Report PDF...')}>🚀 Generate Official PDF</button>
          <button className="btn btn-outline" style={{ padding: '12px 30px' }} onClick={() => alert('Schedule Saved.')}>💾 Save Scan Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
