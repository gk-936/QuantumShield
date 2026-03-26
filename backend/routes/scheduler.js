const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const { performTriadScan } = require('../services/scanner-engine');
const { analyzeVulnerabilities } = require('../services/ai-service');

let schedules = [];

router.post('/create', (req, res) => {
  const { frequency, targets } = req.body;
  const newSchedule = { id: Date.now(), frequency, targets };
  
  const cronExpr = frequency === 'daily' ? '0 0 * * *' : '0 0 * * 1'; // Default to daily or weekly
  
  const task = cron.schedule(cronExpr, async () => {
    console.log(`[SCHEDULE] Running automated scan for targeted assets`);
    try {
      const results = await performTriadScan(targets.web, targets.vpn, targets.api);
      await analyzeVulnerabilities(results);
      // Results are persisted/logged locally for now as email is disabled
      console.log(`[SCHEDULE] Scan completed successfully.`);
    } catch (err) {
      console.error('Scheduled Scan Failed:', err.message);
    }
  });

  schedules.push({ ...newSchedule, task });
  res.json({ success: true, schedule: { frequency, targets } });
});

router.get('/list', (req, res) => {
  res.json(schedules.map(s => ({ id: s.id, frequency: s.frequency, targets: s.targets })));
});

module.exports = router;
