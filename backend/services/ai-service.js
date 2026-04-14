const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
const MODEL = 'sarvam-105b';

/**
 * Analyzes scan results for quantum vulnerabilities using Sarvam AI.
 * @param {Object} scanResults - The JSON output from the Triad scan.
 * @returns {Promise<Object>} - The AI's analysis and suggestions.
 */
async function analyzeVulnerabilities(scanResults) {
  if (!SARVAM_API_KEY) {
    console.warn('SARVAM_API_KEY not found. Returning mock analysis.');
    return {
      summary: "AI Analysis skipped (API Key missing). The scan reveals potential quantum risks in RSA/ECC implementations.",
      suggestions: [
        { issue: "RSA-2048", alternative: "ML-KEM-768" },
        { issue: "JWT RS256", alternative: "ML-DSA-65" }
      ]
    };
  }

  const prompt = `
    As a post-quantum cryptography (PQC) expert, analyze the following Triad Scan results for a bank (PNB).
    Identify cryptographic algorithms vulnerable to quantum computing (RSA, ECC, DH).
    Summarize the risks (Harvest-Now-Decrypt-Later).
    Suggest NIST-approved PQC alternatives (ML-KEM, ML-DSA, SLH-DSA).

    Scan Results:
    ${JSON.stringify(scanResults, null, 2)}

    IMPORTANT: Return ONLY a valid JSON object. No markdown, no filler text.
    JSON structure:
    {
      "summary": "...",
      "risks": ["risk1", "risk2"],
      "suggestions": [{ "issue": "...", "alternative": "...", "description": "..." }]
    }
  `;

  try {
    const response = await axios.post(SARVAM_API_URL, {
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a PQC Migration Expert. You output ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1 // Keep it deterministic for JSON output
    }, {
      headers: { 'Authorization': `Bearer ${SARVAM_API_KEY}` }
    });

    const aiText = response.data.choices[0].message.content;
    const cleanedJson = aiText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Sarvam AI Analysis Error:', error.response?.data || error.message);
    throw new Error('Failed to analyze results with Sarvam AI.');
  }
}

/**
 * Interactive chat for remediation expert queries using Sarvam AI.
 */
async function askRemediationExpert(question, history = []) {
    if (!SARVAM_API_KEY) return { text: "AI Expert Offline. Please check SARVAM_API_KEY in .env." };

    const messages = [
        {
            role: 'system',
            content: `Role: You are the Qubit-Guard Architect, a Tier-3 Cryptographic Migration Expert.
            Pillars of Knowledge: ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205), FN-DSA, XMSS/LMS, BIKE/HQC.
            Policy: Group findings into Infrastructure Pillars A-E. Prioritize Hybrid (Classical + PQC) approach for banks.`
        }
    ];

    history.forEach(h => {
        messages.push({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.content
        });
    });

    messages.push({ role: 'user', content: question });

    try {
        const response = await axios.post(SARVAM_API_URL, {
            model: MODEL,
            messages
        }, {
            headers: { 'Authorization': `Bearer ${SARVAM_API_KEY}` }
        });

        return { text: response.data.choices[0].message.content };
    } catch (error) {
        console.error('Sarvam AI Chat Error:', error.message);
        throw new Error('Sarvam AI Expert unavailable.');
    }
}

async function generateRemediation(findings, targetAlgo) {
  if (!SARVAM_API_KEY) return null;

  const prompt = `
    As a PQC Migration Expert, generate actual remediation code (Shell or Terraform) for: ${JSON.stringify(findings, null, 2)}
    Target PQC algorithm: ${targetAlgo}.
    
    Return ONLY a JSON array of objects: [{ "type": "bash", "title": "...", "code": "..." }, { "type": "terraform", "title": "...", "code": "..." }]
  `;

  try {
    const response = await axios.post(SARVAM_API_URL, {
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a PQC Architect. Output ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${SARVAM_API_KEY}` }
    });

    const aiText = response.data.choices[0].message.content;
    const cleanedJson = aiText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Sarvam Remediation Generation Error:', error.message);
    return null;
  }
}

module.exports = { analyzeVulnerabilities, askRemediationExpert, generateRemediation };
