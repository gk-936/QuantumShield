const aiService = require('./ai-service');

/**
 * Generates remediation scripts (Terraform, Bash, K8s) based on AI analysis.
 */
async function generateRemediationScripts(findings, targetAlgo = "ML-KEM-768") {
    try {
        // Attempt AI generation
        const aiScripts = await aiService.generateRemediation(findings, targetAlgo);
        if (aiScripts && aiScripts.length > 0) return aiScripts;

        // Fallback for demo if AI fails or no key
        return [
            {
                type: 'bash',
                title: 'Nginx TLS 1.3 Post-Quantum Hardening',
                code: `# Update Nginx config to enforce TLS 1.3 and PQC-hybrid group\nsed -i 's/ssl_protocols.*/ssl_protocols TLSv1.3;/' /etc/nginx/nginx.conf\nsed -i 's/ssl_ciphers.*/ssl_ciphers x25519_kyber768:ECDHE-RSA-AES256-GCM-SHA384;/' /etc/nginx/nginx.conf\nnginx -t && systemctl reload nginx`.trim()
            },
            {
                type: 'kubernetes',
                title: 'Istio Hybrid-KEM Sidecar Filter',
                code: `apiVersion: networking.istio.io/v1alpha3\nkind: EnvoyFilter\nmetadata:\n  name: pqc-hybrid-filter\nspec:\n  configPatches:\n  - applyTo: NETWORK_FILTER\n    match:\n      listener:\n        filterChain:\n          filter:\n            name: "envoy.filters.network.http_connection_manager"\n    patch:\n      operation: MERGE\n      value:\n        typed_config:\n          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager\n          common_http_protocol_options:\n            tls_params:\n              tls_maximum_protocol_version: TLSv1_3\n              cipher_suites: ["[TLS_AES_256_GCM_SHA384]"]`.trim()
            }
        ];
    } catch (err) {
        console.error('Remediation Fallback:', err.message);
        return [];
    }
}

module.exports = { generateRemediationScripts };
