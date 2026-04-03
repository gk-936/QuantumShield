const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Analyzes scan results for quantum vulnerabilities using Gemini AI.
 * @param {Object} scanResults - The JSON output from the Triad scan.
 * @returns {Promise<Object>} - The AI's analysis and suggestions.
 */
async function analyzeVulnerabilities(scanResults) {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found. Returning mock analysis.');
    return {
      summary: "AI Analysis skipped (API Key missing). The scan reveals potential quantum risks in RSA/ECC implementations.",
      suggestions: [
        { issue: "RSA-2048", alternative: "ML-KEM-768" },
        { issue: "JWT RS256", alternative: "ML-DSA-65" }
      ]
    };
  }

  const prompt = `
    As a post-quantum cryptography (PQC) expert, analyze the following Triad Scan results for a banking environment (PNB).
    Identify cryptographic algorithms vulnerable to quantum computing (e.g., RSA, ECC, Diffie-Hellman).
    Summarize the risks (Harvest-Now-Decrypt-Later).
    Suggest NIST-approved PQC alternatives (ML-KEM, ML-DSA, SLH-DSA).

    Scan Results:
    ${JSON.stringify(scanResults, null, 2)}

    Format the response as a JSON object with:
    - summary (string): High-level overview.
    - risks (array of strings): Specific risks identified.
    - suggestions (array of objects): { issue, alternative, description }.
  `;

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    // Clean JSON from potential markdown blocks
    const cleanedJson = aiText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('AI Analysis Error:', error.response?.data || error.message);
    throw new Error('Failed to analyze results with AI.');
  }
}

/**
 * Interactive chat for remediation expert queries.
 */
async function askRemediationExpert(question, history = []) {
    if (!GEMINI_API_KEY) return { text: "AI Expert Offline. Please check API Key." };

    const contents = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
    }));

    contents.push({
        role: 'user',
        parts: [{ text: `
Role: You are the QuantumShield.AI Architect, a Tier-3 Cryptographic Migration Expert. Your mission is to audit public-facing infrastructure (Web, VPN, API) and transition it from classical math to NIST-finalized Post-Quantum Cryptography (PQC).

I. Core Knowledge Base (The 6 Pillars):
- ML-KEM (FIPS 203): Primary recommendation for Key Exchange in TLS and VPNs.
- ML-DSA (FIPS 204): Primary recommendation for Digital Signatures (Certificates/JWTs).
- SLH-DSA (FIPS 205): "Plan B" stateless hash-based signature for ultra-high-value transactions.
- FN-DSA (Falcon): Specialized recommendation for low-bandwidth environments (Mobile Apps).
- XMSS/LMS: Mandatory recommendation for Hardware/Firmware integrity (ATMs/HSMs).
- BIKE/HQC: Secondary KEM recommendation for long-term data archival.

II. Operational Directives:
1. Triad Analysis: Group technical findings into Pillar A (Web), Pillar B (VPN), or Pillar C (API).
2. Downgrade Detection: Analyze "Cipher Suite Preference." If a server supports PQC but prioritizes RSA/ECC, flag this as a "Soft-Vulnerability" and lower the QVS score.
3. QVS Logic (FR-06): Score 100 (RSA-2048, ECC, DH), Score 10 (Draft PQC), Score 0 (Correct ML-KEM/ML-DSA/SLH-DSA).
4. CBOM Output (FR-08): Format assets into CycloneDX 1.5 JSON. Include bit-depth, OIDs, and NIST status.
5. Remediation (FR-11): Advocate for Hybrid Approach (Classical + PQC) for PNB systems.

III. Response Protocol:
- NEVER use introductory filler ("I can help with that," "Based on the data").
- Provide direct technical outputs: JSON blocks for CBOMs and Shell/Python snippets for hardening.
- Reference CERT-In Annexure-A compliance requirements for all PNB-related reports.

Current Technical Request: ${question}` }]
    });

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, { contents });
        return { text: response.data.candidates[0].content.parts[0].text };
    } catch (error) {
        console.error('Expert AI Chat Error:', error.message);
        throw new Error('AI Expert unavailable.');
    }
}

async function generateRemediation(findings, targetAlgo) {
  if (!GEMINI_API_KEY) return null;

  const prompt = `
    As a PQC Migration Expert, generate actual remediation code (Shell or Terraform) for the following vulnerabilities:
    ${JSON.stringify(findings, null, 2)}
    
    The target PQC algorithm is: ${targetAlgo}.
    
    Provide exactly two code blocks:
    1. A Bash script for OS/Web Server hardening.
    2. A Kubernetes or Terraform block for infrastructure-level PQC enforcement.
    
    Return as a JSON array of objects: [{ "type": "bash", "title": "...", "code": "..." }, { "type": "terraform", "title": "...", "code": "..." }]
  `;

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const aiText = response.data.candidates[0].content.parts[0].text;
    const cleanedJson = aiText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Remediation Generation Error:', error.message);
    return null;
  }
}

module.exports = { analyzeVulnerabilities, askRemediationExpert, generateRemediation };
