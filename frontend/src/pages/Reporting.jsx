import React, { useState } from 'react';

const Reporting = () => {
  const [reportType, setReportType] = useState('executive');
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <div id="page-reporting" className="page-view">
      <div className="report-options">
        <div className={`report-card ${reportType === 'executive' ? 'active' : ''}`} onClick={() => setReportType('executive')}>
          <div className="rc-icon">🏢</div>
          <div className="rc-title">Executive Summary</div>
          <div className="rc-desc">High-level risk posture and PQC readiness score for management.</div>
        </div>
        <div className={`report-card ${reportType === 'technical' ? 'active' : ''}`} onClick={() => setReportType('technical')}>
          <div className="rc-icon">🛠️</div>
          <div className="rc-title">Technical CBOM</div>
          <div className="rc-desc">Detailed cryptographic inventory and per-asset vulnerability analysis.</div>
        </div>
        <div className={`report-card ${reportType === 'compliance' ? 'active' : ''}`} onClick={() => setReportType('compliance')}>
          <div className="rc-icon">⚖️</div>
          <div className="rc-title">Compliance Audit</div>
          <div className="rc-desc">Gap analysis against NIST PQC standards and internal PNB security policies.</div>
        </div>
      </div>

      <div className="card report-form-area visible">
        <div className="card-title">Report Configuration & Automation</div>
        <div className="sched-form">
          <div>
            <div className="form-group">
              <label className="form-label">Report Format</label>
              <div className="checkbox-group">
                <label className="checkbox-item"><input type="checkbox" defaultChecked /> PDF</label>
                <label className="checkbox-item"><input type="checkbox" /> Excel (CSV)</label>
                <label className="checkbox-item"><input type="checkbox" /> JSON (CycloneDX)</label>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <div className="delivery-row">
                <div className={`toggle-sw ${isScheduled ? 'on' : ''}`} onClick={() => setIsScheduled(!isScheduled)}></div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Enable Automated Scanning & Local Logging</div>
              </div>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '4px', marginLeft: '54px' }}>Automatically run the Triad Scan and log results to the security dashboard.</p>
            </div>
          </div>
          <div style={{ opacity: isScheduled ? 1 : 0.5, pointerEvents: isScheduled ? 'auto' : 'none' }}>
            <div className="form-group">
              <label className="form-label">Schedule Frequency</label>
              <select className="form-select">
                <option>Every Day (Daily)</option>
                <option>Every Monday (Weekly)</option>
                <option>1st of Every Month (Monthly)</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', gap: '10px' }}>
          <button className="btn btn-gold">🚀 Generate One-Time Report Now</button>
          <button className="btn btn-outline">💾 Save Automation Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
