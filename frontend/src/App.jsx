import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Discovery from './pages/Discovery';
import CBOM from './pages/CBOM';
import Posture from './pages/Posture';
import Rating from './pages/Rating';
import Reporting from './pages/Reporting';
import TriadScanner from './pages/TriadScanner';
import Remediation from './pages/Remediation';
import QDaySimulator from './pages/QDaySimulator';
import MobileScanner from './pages/MobileScanner';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to true for development

  const Login = () => (
    <div id="login-page">
      <div className="hk-bg"></div>
      <div className="login-box">
        <div className="login-logo">
          <div className="shield-logo">
            <svg className="shield-svg" viewBox="0 0 80 90" fill="none">
              <path d="M40 5L75 18V45C75 64 58 80 40 88C22 80 5 64 5 45V18L40 5Z" fill="url(#sg)" stroke="#D4A017" strokeWidth="2"/>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="80" y2="90" gradientUnits="userSpaceOnUse"><stop stopColor="#8B1A1A"/><stop offset="1" stopColor="#6B0F0F"/></linearGradient></defs>
              <text x="40" y="52" fontFamily="Cinzel,serif" fontSize="18" fill="#D4A017" fontWeight="700" textAnchor="middle">PNB</text>
              <text x="40" y="66" fontFamily="Exo 2,sans-serif" fontSize="7" fill="rgba(255,255,255,0.8)" textAnchor="middle" letterSpacing="1">PQC-Ready</text>
              <circle cx="40" cy="30" r="10" fill="none" stroke="#D4A017" strokeWidth="1.5" strokeDasharray="3 2"/>
              <path d="M34 30L38 34L47 25" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="login-title">QuantumShield.AI</div>
        </div>
        <label className="login-label">Email / Username</label>
        <input className="login-input" type="text" defaultValue="hackathon_user@pnb.bank.in" />
        <label className="login-label">Password</label>
        <input className="login-input" type="password" defaultValue="••••••••" />
        <span className="login-forgot">Forgot Password?</span>
        <button className="login-btn" onClick={() => setIsLoggedIn(true)}>Sign In</button>
      </div>
      <div className="login-right">
        <div style={{ fontSize: '13px', opacity: 0.8, letterSpacing: '3px', marginBottom: '8px' }}>PSB HACKATHON SERIES</div>
        <div style={{ fontSize: '16px', opacity: 0.8, marginBottom: '6px' }}>In collaboration with IIT Kanpur</div>
        <h1>PNB Cybersecurity<br/>Hackathon 2026</h1>
        <h2 style={{ marginTop: '12px' }}>Cyber Innovation Begins</h2>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="cbom" element={<CBOM />} />
        <Route path="posture" element={<Posture />} />
        <Route path="rating" element={<Rating />} />
        <Route path="reporting" element={<Reporting />} />
        <Route path="triad" element={<TriadScanner />} />
        <Route path="remediation" element={<Remediation />} />
        <Route path="qday" element={<QDaySimulator />} />
        <Route path="mobile" element={<MobileScanner />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
