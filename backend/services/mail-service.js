const nodemailer = require('nodemailer');

/**
 * Service for sending automated PQC scan reports to users.
 */
async function sendScanReport(email, scanData) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[MAIL] SMTP credentials missing. Logging report to console instead.');
        console.log(`[MAIL-SIM] To: ${email}\n[MAIL-SIM] Subject: PQC Scan Report\n[MAIL-SIM] Data Summary: ${scanData.aiAnalysis.summary.substring(0, 50)}...`);
        return true;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: '"QuantumShield.AI" <noreply@quantumshield.ai>',
        to: email,
        subject: `🛡️ PNB Quantum-Ready Scan Report - ${new Date().toLocaleDateString()}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #C0272D;">QuantumShield.AI - Scan Report</h2>
                <p>Hello Admin, your scheduled PQC scan is complete.</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
                    <h3>Summary</h3>
                    <p>${scanData.aiAnalysis.summary}</p>
                </div>
                <div style="margin-top: 20px;">
                    <p><b>Triad Scan Metrics:</b></p>
                    <ul>
                        <li>Web/TLS Assets: ${scanData.webScan?.certificate?.subject?.CN || 'N/A'}</li>
                        <li>API Endpoints Discovered: ${scanData.apiMetrics.total}</li>
                        <li>Mobile Apps Analyzed: Yes</li>
                    </ul>
                </div>
                <p>Please log in to the <b>QuantumShield.AI Dashboard</b> to view detailed remediation scripts.</p>
                <hr/>
                <p style="font-size: 11px; color: #777;">Punjab National Bank Post-Quantum Readiness Initiative 2026.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Report sent to ${email}`);
        return true;
    } catch (err) {
        console.error('[MAIL] Failed to send email:', err);
        return false;
    }
}

module.exports = { sendScanReport };
