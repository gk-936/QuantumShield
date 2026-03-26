const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
        parts: [{ text: `You are a PQC (Post-Quantum Cryptography) expert at Punjab National Bank (PNB). Answer this question based on NIST standards (ML-KEM, ML-DSA): ${question}` }]
    });

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, { contents });
        return { text: response.data.candidates[0].content.parts[0].text };
    } catch (error) {
        console.error('Expert AI Chat Error:', error.message);
        throw new Error('AI Expert unavailable.');
    }
}

module.exports = { analyzeVulnerabilities, askRemediationExpert };
