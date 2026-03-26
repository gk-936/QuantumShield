const cron = require('node-cron');
const { performTriadScan } = require('./scanner-engine');
const { discoverEndpoints } = require('./api-scanner');
const { analyzeVulnerabilities } = require('./ai-service');
const { sendScanReport } = require('./mail-service');
const dbManager = require('./db-manager');

/**
 * Initializes the automated scan scheduler.
 */
function initScheduler() {
    console.log('[SCHEDULER] Initializing automated PQC scanning (Trigger: Daily 00:00)...');

    // Default schedule: Every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('[SCHEDULER] Starting scheduled scan sequence...');
        
        // Use default banking assets for scheduled check
        const targets = {
            webUrl: 'pnbindia.in',
            apiUrl: 'api.pnbindia.in',
            email: 'admin@pnb.com'
        };

        try {
            const scanResults = await performTriadScan(targets.webUrl, null, targets.apiUrl);
            const apiMetrics = await discoverEndpoints(targets.apiUrl);
            const aiAnalysis = await analyzeVulnerabilities({ ...scanResults, apiMetrics });
            
            const fullReport = { ...scanResults, apiMetrics, aiAnalysis };
            
            // Send Automated Email
            await sendScanReport(targets.email, fullReport);
            
            console.log('[SCHEDULER] Automated scan & report completed successfully.');
        } catch (err) {
            console.error('[SCHEDULER] Scheduled scan failed:', err.message);
        }
    });

    console.log('[SCHEDULER] Automatic daily scans are now active.');
}

module.exports = { initScheduler };
