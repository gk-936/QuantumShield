const express = require('express');
const router = express.Router();
const { generateRemediationScripts } = require('../services/remediation-service');

router.post('/generate', async (req, res) => {
    const { findings } = req.body;
    try {
        const scripts = await generateRemediationScripts(findings);
        res.json({ success: true, scripts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
