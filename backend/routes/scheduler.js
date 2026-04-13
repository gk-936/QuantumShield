const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { performTriadScan } = require('../services/scanner-engine');
const { analyzeVulnerabilities } = require('../services/ai-service');
const { discoverEndpoints } = require('../services/api-scanner');
const { sendScanReport } = require('../services/mail-service');

let schedules = [];

router.post('/create', (req, res) => {
  const { frequency, targets, scheduled_time, email, report_type } = req.body;
  const newSchedule = { 
    id: Date.now(), 
    frequency, 
    targets, 
    scheduled_time, 
    email, 
    report_type 
  };
  
  // Parse time (HH:mm)
  let cronExpr = '0 0 * * *'; // Default
  if (scheduled_time) {
    const [hours, minutes] = scheduled_time.split(':');
    if (frequency === 'daily') {
      cronExpr = `${minutes} ${hours} * * *`;
    } else if (frequency === 'weekly') {
      cronExpr = `${minutes} ${hours} * * 1`; // Mondays
    } else {
      // For 'once' or others
      cronExpr = `${minutes} ${hours} * * *`; 
    }
  }

  const task = cron.schedule(cronExpr, async () => {
    console.log(`[SCHEDULE] Triggering automated FRESH SCAN sequence for: ${email}`);
    try {
      // 1. Fresh Triad Scan
      const webUrl = targets.webUrl || targets.web || "www.pnbindia.in";
      const vpnUrl = targets.vpnUrl || targets.vpn || "vpn.pnbindia.in";
      const apiUrl = targets.apiUrl || targets.api || "api.pnbindia.in";
      
      console.log(`[SCHEDULE] Running Triad Scan on ${webUrl}...`);
      const scanResults = await performTriadScan(webUrl, vpnUrl, apiUrl);
      
      // 2. Fresh API Discovery
      console.log(`[SCHEDULE] Discovering endpoints for ${apiUrl}...`);
      const apiMetrics = await discoverEndpoints(apiUrl);
      
      // 3. AI Vulnerability Analysis
      console.log(`[SCHEDULE] Running AI Analysis...`);
      const aiAnalysis = await analyzeVulnerabilities({ ...scanResults, apiMetrics });
      
      const fullReport = {
        ...scanResults,
        apiMetrics,
        aiAnalysis,
        report_type: report_type || 'executive'
      };

      // 4. Send Email Report
      console.log(`[SCHEDULE] Dispatching report to ${email}...`);
      await sendScanReport(email, fullReport);
      
      console.log(`[SCHEDULE] Automated scan & email sequence completed.`);
    } catch (err) {
      console.error('[SCHEDULE] Automated Task Failed:', err.message);
    }
  });

  schedules.push({ ...newSchedule, task });
  res.json({ 
    success: true, 
    message: `Scan scheduled for ${scheduled_time} (${frequency}) with email dispatch to ${email}.`,
    schedule: { frequency, targets, scheduled_time, email } 
  });
});

router.get('/list', (req, res) => {
  res.json(schedules.map(s => ({ 
    id: s.id, 
    frequency: s.frequency, 
    targets: s.targets,
    scheduled_time: s.scheduled_time,
    email: s.email
  })));
});

module.exports = router;
