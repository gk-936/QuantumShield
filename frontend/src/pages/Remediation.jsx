import React, { useState, useEffect, useRef } from 'react';
import { generateRemediation, chatWithExpert } from '../api';

const Remediation = () => {
  const [remediations, setRemediations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  // Chat State
  const [messages, setMessages] = useState([{ role: 'model', content: "Hello! I am the QuantumShield PQC Expert. How can I help you secure PNB's infrastructure today?" }]);
  const [chatValue, setChatValue] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatValue.trim() || isChatting) return;

    const userMsg = { role: 'user', content: chatValue };
    setMessages(prev => [...prev, userMsg]);
    setChatValue('');
    setIsChatting(true);

    try {
      const res = await chatWithExpert(chatValue, messages);
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'model', content: res.data.response.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Expert service interrupted. Please check API connectivity." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const loadFixes = async () => {
    setIsLoading(true);
    try {
      const res = await generateRemediation([]); // Passing empty findings for now to get defaults
      if (res.data.success) {
        setRemediations(res.data.scripts);
      }
    } catch (err) {
      console.error('Failed to load remediation fixes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFixes();
  }, []);

  return (
    <div id="page-remediation" className="page-view">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="card-title">AI Auto-Remediation Deployment Scripts</div>
          <button className="btn btn-gold btn-sm" onClick={loadFixes} disabled={isLoading}>
            {isLoading ? 'Generating...' : '⚡ Regenerate AI Fixes'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
            The AI engine has parsed your Triad Scan results and generated standard PQC migration snippets (NIST SP 800-207/9370).
        </p>
        
        {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--pnb-red)', fontFamily: 'var(--mono)' }}>⚡ RUNNING AI REMEDIATION ENGINE...</div>
        ) : (
            <div className="remed-accordion">
            {remediations.map((r, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                <div className="remed-header" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                    <h4>{r.title}</h4>
                    <span className="risk-badge rb-low" style={{ marginLeft: '10px', fontSize: '10px' }}>{r.type.toUpperCase()}</span>
                    <span style={{ marginLeft: 'auto' }}>{openIndex === i ? '−' : '+'}</span>
                </div>
                <div className={`remed-body ${openIndex === i ? 'open' : ''}`}>
                    <div className="code-snippet">
                    <pre>{r.code}</pre>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button className="btn btn-gold btn-sm">🚀 Deploy via Ansible</button>
                        <button className="btn btn-outline btn-sm">📋 Copy Snippet</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* AI Expert Chat Section */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <div className="card-title" style={{ fontSize: '15px' }}>💬 QuantumShield AI Expert Chat</div>
            <div className="chat-container" style={{ background: '#f9f9f9', borderRadius: '8px', padding: '15px', height: '300px', overflowY: 'auto', marginBottom: '15px', border: '1px solid #eee' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: '12px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                        <div style={{ 
                            display: 'inline-block', 
                            padding: '10px 14px', 
                            borderRadius: '12px', 
                            maxWidth: '80%',
                            fontSize: '12px',
                            background: m.role === 'user' ? 'var(--pnb-red)' : 'white',
                            color: m.role === 'user' ? 'white' : '#333',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: m.role === 'model' ? '1px solid #ddd' : 'none'
                        }}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isChatting && <div style={{ fontSize: '11px', color: '#888' }}>⚡ AI Expert is typing...</div>}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white' }}
                    placeholder="Ask about PQC migration (e.g., 'How to implement ML-DSA in Java?')..."
                    value={chatValue}
                    onChange={(e) => setChatValue(e.target.value)}
                    disabled={isChatting}
                />
                <button type="submit" className="btn btn-gold" disabled={isChatting || !chatValue.trim()}>
                    Send Query
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Remediation;
