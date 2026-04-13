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

    const webCN = scanData.findings?.web?.find(f => f.issue?.includes('Certificate'))?.issue?.split(': ')[1] || 'Detected Assets';
    const apiCount = scanData.apiMetrics?.total || 0;

    const mailOptions = {
        from: '"Qubit-Guard" <noreply@qubit-guard.io>',
        to: email,
        subject: `🛡️ PNB Quantum-Ready Scan Report - ${new Date().toLocaleDateString()}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #C0272D;">Qubit-Guard - Automated PQC Scan Report</h2>
                <p>Hello Admin, your scheduled fresh scan of the PNB infrastructure is complete.</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #C0272D; margin: 20px 0;">
                    <h3 style="margin-top: 0;">AI Threat Summary</h3>
                    <p style="line-height: 1.6;">${scanData.aiAnalysis?.summary || 'No summary available.'}</p>
                </div>

                <div style="margin-top: 30px;">
                    <h4 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Automated Triad Scan Metrics</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><b>Web/TLS Target:</b></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${webCN}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><b>API Endpoints:</b></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${apiCount} discovered</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;"><b>Compliance Status:</b></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #D4AF37;"><b>Quantum-Vulnerable (Tier 4)</b></td>
                        </tr>
                    </table>
                </div>

                <p style="margin-top: 30px;">Detailed remediation playbooks and CBOM exports are available in your portal.</p>
                <a href="http://localhost:5173" style="display: inline-block; background: #D4AF37; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Full Audit in Dashboard</a>
                
                <hr style="margin-top: 40px; border-top: 1px solid #eee;"/>
                <p style="font-size: 11px; color: #777; text-align: center;">Punjab National Bank | Post-Quantum Cybersecurity Division 2026</p>
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
