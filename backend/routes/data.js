const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper to read JSON database files
const readDbFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../database', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return null;
  }
};

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

// GET /api/data/cbom
router.get('/cbom', (req, res) => {
  const data = readDbFile('cbom.json');
  if (data) res.json({ success: true, data });
  else res.status(500).json({ success: false, message: 'Database error' });
});

module.exports = router;
