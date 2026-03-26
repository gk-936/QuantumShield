import React, { useState } from 'react';

const Remediation = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const remediations = [
    {
      title: 'Upgrade Web Server to TLS 1.3 with Hybrid PQC',
      desc: 'Enable X25519MLKEM768 key exchange on Nginx/Apache to prevent store-now-decrypt-later attacks.',
      code: `// Nginx Configuration (Draft)
ssl_protocols TLSv1.3;
ssl_groups x25519_mlkem768:x25519:secp256r1;
ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;`
    },
    {
      title: 'Transition JWT to ML-DSA Signing',
      desc: 'Replace RSA-2048/3072 signature algorithms with NIST-approved ML-DSA (Dilithium) to ensure quantum-resistant authentication.',
      code: `// Node.js Jose/JWT implementation
const { sign } = require('pqc-crypto-library');
const token = sign(payload, privateKey, { alg: 'ML-DSA-65' });`
    },
    {
      title: 'Enable RFC 9370 (Multiple Key Exchanges) for VPN',
      desc: 'Configure IPsec/IKEv2 gateways to support hybrid key exchange as per NIST/IETF standards.',
      code: `# IKEv2 Proposal
ikev2-proposal PQC-HYBRID {
  encryption-algorithm aes-256-gcm
  prf-algorithm hmac-sha384
  dh-group 31  # X25519
  additional-key-exchange mlkem768
}`
    }
  ];

  return (
    <div id="page-remediation" className="page-view">
      <div className="card">
        <div className="card-title">Recommended PQC Remediation Paths</div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>Select an identified vulnerability to view the automated fix deployment snippets.</p>
        <div className="remed-accordion">
          {remediations.map((r, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <div className="remed-header" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                <h4>{r.title}</h4>
                <span>{openIndex === i ? '−' : '+'}</span>
              </div>
              <div className={`remed-body ${openIndex === i ? 'open' : ''}`}>
                <p style={{ fontSize: '12px', color: '#333' }}>{r.desc}</p>
                <div className="code-snippet">
                  <pre>{r.code}</pre>
                </div>
                <button className="btn btn-gold btn-sm" style={{ marginTop: '12px' }}>Apply Fix via Ansible/Terraform</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Remediation;
