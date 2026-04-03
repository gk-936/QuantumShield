const express = require('express');
const router = express.Router();
const { performTriadScan } = require('../services/scanner-engine');
const { analyzeVulnerabilities } = require('../services/ai-service');
const { discoverEndpoints } = require('../services/api-scanner');
const { logAuditEvent } = require('../services/audit-service');
const dbManager = require('../services/db-manager');
const { v4: uuidv4 } = require('uuid'); // I'll use Date.now() if uuid isn't there, but let's try uuid.

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
    
    const finalData = {
      ...scanResults,
      apiMetrics,
      aiAnalysis
    };

    // --- Persistence Logic ---
    const scans = dbManager.read('scans.json') || [];
    const newScan = {
      id: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: req.user?.username || 'hackathon_user', // Fallback for prototype
      target: webUrl,
      data: finalData
    };
    scans.unshift(newScan); // Newest first
    dbManager.write('scans.json', scans.slice(0, 50)); // Keep last 50

    res.json({
      success: true,
      data: {
        ...finalData,
        scanId: newScan.id
      }
    });
  } catch (error) {
    console.error('Scan Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/scan/history
router.get('/history', (req, res) => {
  const scans = dbManager.read('scans.json') || [];
  res.json({ success: true, data: scans });
});

module.exports = router;
