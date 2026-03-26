const express = require('express');
const router = express.Router();
const { searchPNBApps, scanMobileApp } = require('../services/mobile-scanner');

// Search for PNB Apps
router.get('/search', async (req, res) => {
  try {
    const apps = await searchPNBApps();
    res.json({ success: true, apps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Scan a specific App
router.post('/scan', async (req, res) => {
  const { appId, platform } = req.body;
  try {
    const results = await scanMobileApp(appId, platform);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
