const express = require('express');
const router = express.Router();
const dbManager = require('../services/db-manager');

const readDbFile = (filename) => dbManager.read(filename);

// GET /api/data/dashboard
router.get('/dashboard', (req, res) => {
  const data = readDbFile('dashboard.json');
  if (data) res.json({ success: true, data });
  else res.status(500).json({ success: false, message: 'Database error' });
});

// GET /api/data/inventory
router.get('/inventory', (req, res) => {
  const data = readDbFile('inventory.json');
  if (data) res.json({ success: true, data });
  else res.status(500).json({ success: false, message: 'Database error' });
});

const { generateCycloneDX } = require('../services/cbom-generator');

// GET /api/data/cbom
router.get('/cbom', (req, res) => {
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
