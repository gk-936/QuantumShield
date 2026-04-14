const express = require('express');
const router = express.Router();
const { performTriadScan } = require('../services/scanner-engine');
const { analyzeVulnerabilities } = require('../services/ai-service');
const { discoverEndpoints } = require('../services/api-scanner');
const { logAuditEvent } = require('../services/audit-service');
const dbManager = require('../services/db-manager');

// Full Triad Scan
router.post('/triad', async (req, res) => {
  const { webUrl, vpnUrl, apiUrl, jwtToken } = req.body;

  logAuditEvent({ action: 'START_TRIAD_SCAN', target: webUrl, user: 'hackathon_user' });

  try {
    // 1. Run the scanning engine (Web, VPN, JWT, Firmware, Archival)
    const scanResults = await performTriadScan(webUrl, vpnUrl, apiUrl, jwtToken);

    // 2. Discover API endpoints and fingerprint technology
    const apiMetrics = await discoverEndpoints(apiUrl || webUrl);

    // 3. Synthesize Professional CBOM (Clustered by Service)
    const cbomItems = [];
    
    // Cluster the Web Infrastructure
    if (scanResults.findings.web.length > 0) {
        cbomItems.push({
            component: `Web Application Infrastructure (${webUrl})`,
            category: 'Gateway / Web',
            version: scanResults.findings.web[0].raw?.server || 'Nginx/1.18.0',
            algorithm: scanResults.findings.web[0].raw?.cipher || 'RSA-2048',
            purl: `pkg:web/${webUrl.replace('https://', '').replace('http://', '')}@latest`,
            quantumSafe: false,
            risk: 'High'
        });
    }

    // Cluster Discovery results into "Services" (Host-Level Clustering)
    const hostClusters = {};
    apiMetrics.details.forEach(ep => {
        if (!hostClusters[ep.host]) {
            hostClusters[ep.host] = {
                host: ep.host,
                server: ep.server,
                bucket: ep.bucket,
                pathsCount: 0
            };
        }
        hostClusters[ep.host].pathsCount++;
    });

    Object.values(hostClusters).forEach(cluster => {
        const cleanServer = (cluster.server || 'Generic').split('/')[0].toLowerCase();
        cbomItems.push({
            component: `${cluster.server || 'Generic'} Infrastructure Node (${cluster.host})`,
            category: cluster.bucket,
            version: cluster.server === 'Unknown' ? 'v1.0' : cluster.server,
            algorithm: scanResults.findings.web[0].raw?.cipher || 'RSA-2048', // Inherit host crypto
            purl: `pkg:service/${cleanServer}@${cluster.server.split('/')[1] || '1.0'}?host=${cluster.host}`,
            quantumSafe: false,
            risk: 'High'
        });
    });

    // 4. AI Analysis
    const aiAnalysis = await analyzeVulnerabilities({ ...scanResults, apiMetrics, cbomItems });

    const finalData = {
      ...scanResults,
      apiMetrics,
      cbom: { components: cbomItems },
      aiAnalysis
    };

    // --- Persistence Logic ---
    const scans = dbManager.read('scans.json') || [];
    const newScan = {
      id: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'hackathon_user',
      target: webUrl,
      data: finalData
    };
    scans.unshift(newScan);
    dbManager.write('scans.json', scans.slice(0, 50));

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
