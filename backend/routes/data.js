const express = require('express');
const router = express.Router();
const dbManager = require('../services/db-manager');

const readDbFile = (filename) => dbManager.read(filename);

// Helper to extract specific data from a scan result
const getHistoricalData = (scanId, type) => {
  const scans = dbManager.read('scans.json') || [];
  const scan = scans.find(s => s.id === scanId);
  if (!scan) return null;

  const data = scan.data;
  if (type === 'dashboard') {
    return {
      summary: {
        assetsDiscovery: { value: data.discovery?.total_found || '0', label: 'Assets Discovery', subtext: 'Discovered in this scan' },
        cyberRating: { value: `${data.aiAnalysis?.overallScore || 0}/1000`, label: 'Cyber Rating', subtext: 'Historical Score' },
        sslCerts: { value: data.findings?.web?.length || '0', label: 'Active SSL Certs', subtext: 'Findings in scan' },
        cbomVulnerabilities: { value: data.cbom?.components?.length || '0', label: 'CBOM Items', subtext: 'At time of scan' }
      },
      inventory: { 
        ssl: data.findings?.web?.length || 0,
        software: data.cbom?.components?.length || 0,
        iot: 0,
        logins: 0 
      },
      posture: {
        mlKemAdoption: data.aiAnalysis?.pqcReadiness || 0,
        mlDsaTransition: 0,
        legacyRemoval: 0
      },
      cbomSummary: {
        critical: data.cbom?.components?.filter(c => !c.quantumSafe).length || 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };
  }
  if (type === 'inventory') {
    return {
      items: [
        ...(data.findings?.web?.map(f => ({ type: 'SSL/TLS', name: f.issue, location: 'Web Pillar', risk: 'High' })) || []),
        ...(data.discovery?.assets?.map(a => ({ type: 'Domain', name: a.host, location: 'Discovery Engine', risk: 'Info' })) || [])
      ]
    };
  }
  if (type === 'cbom') {
    return data.cbom;
  }
  return null;
};

// GET /api/data/dashboard
router.get('/dashboard', (req, res) => {
  const scanId = req.headers['x-scan-id'];
  if (scanId) {
    const data = getHistoricalData(scanId, 'dashboard');
    if (data) return res.json({ success: true, data });
  }
  const data = readDbFile('dashboard.json');
  if (data) res.json({ success: true, data });
  else res.status(500).json({ success: false, message: 'Database error' });
});

// GET /api/data/inventory
router.get('/inventory', (req, res) => {
  const scanId = req.headers['x-scan-id'];
  if (scanId) {
    const data = getHistoricalData(scanId, 'inventory');
    if (data) return res.json({ success: true, data });
  }
  const data = readDbFile('inventory.json');
  if (data) res.json({ success: true, data });
  else res.status(500).json({ success: false, message: 'Database error' });
});

const { generateCycloneDX } = require('../services/cbom-generator');

// GET /api/data/cbom
router.get('/cbom', (req, res) => {
  const scanId = req.headers['x-scan-id'];
  if (scanId) {
    const data = getHistoricalData(scanId, 'cbom');
    if (data) return res.json({ success: true, data });
  }
  const data = readDbFile('cbom.json');
  if (data) res.json({ success: true, data });
  else res.status(500).json({ success: false, message: 'Database error' });
});

// GET /api/data/cbom/download
router.get('/cbom/download', (req, res) => {
  const data = readDbFile('cbom.json');
  if (data && data.cbomItems) {
    const cbom = generateCycloneDX(data.cbomItems);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=quantumshield_cbom.json');
    res.send(JSON.stringify(cbom, null, 2));
  } else {
    res.status(500).json({ success: false, message: 'Source data not found' });
  }
});

module.exports = router;
