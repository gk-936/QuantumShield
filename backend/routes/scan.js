const express = require('express');
const router = express.Router();
const { performTriadScan } = require('../services/scanner-engine');
const { analyzeVulnerabilities } = require('../services/ai-service');
const { discoverEndpoints } = require('../services/api-scanner');
const { logAuditEvent } = require('../services/audit-service');

// Full Triad Scan
router.post('/triad', async (req, res) => {
  const { webUrl, vpnUrl, apiUrl, jwtToken } = req.body;
  
  // Log the initiation of the scan
  logAuditEvent({ action: 'START_TRIAD_SCAN', target: webUrl, user: 'hackathon_user' });
  
  try {
    // 1. Run the scanning engine
    const scanResults = await performTriadScan(webUrl, vpnUrl, apiUrl, jwtToken);
    
    // 2. Discover API endpoints and bucketing
    const apiMetrics = await discoverEndpoints(apiUrl || webUrl);
    
    // 3. AI Analysis
    const aiAnalysis = await analyzeVulnerabilities({ ...scanResults, apiMetrics });
    
    res.json({
      success: true,
      data: {
        ...scanResults,
        apiMetrics,
        aiAnalysis
      }
    });
  } catch (error) {
    console.error('Scan Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
