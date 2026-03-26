const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const logFile = path.join(logDir, 'audit.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Log a scan event for non-repudiation and compliance.
 */
function logAuditEvent(event) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        ...event
    };

    const logString = JSON.stringify(logEntry) + '\n';
    
    fs.appendFile(logFile, logString, (err) => {
        if (err) console.error('[AUDIT] Failed to write log:', err);
    });
}

module.exports = { logAuditEvent };
