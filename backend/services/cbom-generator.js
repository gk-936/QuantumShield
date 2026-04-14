/**
 * Generates a CycloneDX v1.5 JSON SBOM based on the provided assets.
 */
function generateCycloneDX(items) {
    const timestamp = new Date().toISOString();
    
    const bom = {
        bomFormat: "CycloneDX",
        specVersion: "1.5",
        serialNumber: `urn:uuid:${require('crypto').randomUUID()}`,
        version: 1,
        metadata: {
            timestamp: timestamp,
            tools: [
                {
                    vendor: "Qubit-Guard",
                    name: "Q-Guard Engine",
                    version: "2.0.0"
                }
            ],
            authors: [
                {
                    name: "Qubit-Guard Security Team",
                    email: "security@qubitguard.ai"
                }
            ],
            supplier: {
                name: "Qubit-Guard Open Source"
            }
        },
        components: items.map(item => ({
            type: "library",
            name: item.component,
            version: item.version,
            purl: item.purl,
            evidence: {
                identity: {
                    field: "purl",
                    confidence: 1.0,
                    methods: [{ technique: "static-analysis", confidence: 1.0 }]
                }
            },
            properties: [
                {
                    name: "quantum-shield:crypto-algorithm",
                    value: item.algorithm
                },
                {
                    name: "quantum-shield:quantum-safe",
                    value: item.quantumSafe ? "true" : "false"
                }
            ]
        }))
    };

    return cbom;
}

module.exports = { generateCycloneDX };
