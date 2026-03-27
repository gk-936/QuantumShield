import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'inventory', icon: '📋', label: 'Asset Inventory' },
    { id: 'discovery', icon: '🔍', label: 'Asset Discovery' },
    { id: 'cbom', icon: '📦', label: 'CBOM' },
    { id: 'posture', icon: '📊', label: 'Posture of PQC' },
    { id: 'rating', icon: '⭐', label: 'Cyber Rating' },
    { id: 'reporting', icon: '📊', label: 'Reporting' },
    { id: 'triad', icon: '⚡', label: 'Triad Scanner', badge: 'NEW' },
    { id: 'mobile', icon: '📱', label: 'Mobile App Scanning' },
    { id: 'remediation', icon: '🔧', label: 'Auto-Remediation' },
    { id: 'qday', icon: '☢️', label: 'Q-Day Simulator' },
  ];

  return (
    <div id="sidebar">
      <div className="sb-logo-area" style={{ padding: '12px', gap: '8px' }}>
        <svg className="sb-shield" viewBox="0 0 60 70" fill="none" style={{ width: '32px', height: '32px' }}>
          <path d="M30 4L56 14V36C56 52 44 63 30 68C16 63 4 52 4 36V14L30 4Z" fill="url(#ss)" stroke="#D4A017" strokeWidth="1.5"/>
          <defs><linearGradient id="ss" x1="0" y1="0" x2="60" y2="70" gradientUnits="userSpaceOnUse"><stop stopColor="#7B1A1A"/><stop offset="1" stopColor="#5B0A0A"/></linearGradient></defs>
          <text x="30" y="40" fontFamily="Cinzel,serif" fontSize="13" fill="#D4A017" fontWeight="700" textAnchor="middle">PNB</text>
          <text x="30" y="52" fontFamily="sans-serif" fontSize="5" fill="rgba(255,255,255,0.7)" textAnchor="middle">PQC-Ready</text>
        </svg>
        <div className="sb-brand">Qubit-Guard Platform</div>
      </div>
      <div className="sb-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.id} 
            to={`/${item.id}`} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="ni-icon">{item.icon}</span>
            <span className="ni-label">{item.label}</span>
            {item.badge && <span className="ni-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </div>
      <div className="sb-footer">
        <div className="sb-user">👤 hackathon_user@pnb.bank.in</div>
        <div className="sb-user" style={{ marginTop: '4px' }}>Role: Admin</div>
      </div>
    </div>
  );
};

export default Sidebar;
