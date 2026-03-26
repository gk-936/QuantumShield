import React from 'react';

const Header = ({ title, onLogout }) => {
  return (
    <div id="topbar">
      <div className="tb-page-title">{title}</div>
      <div className="tb-logo">
        <svg className="tb-logo-shield" viewBox="0 0 60 70" fill="none">
          <path d="M30 4L56 14V36C56 52 44 63 30 68C16 63 4 52 4 36V14L30 4Z" fill="url(#ts)" stroke="#D4A017" strokeWidth="1.5"/>
          <defs><linearGradient id="ts" x1="0" y1="0" x2="60" y2="70" gradientUnits="userSpaceOnUse"><stop stopColor="#8B1A1A"/><stop offset="1" stopColor="#4B0A0A"/></linearGradient></defs>
          <text x="30" y="40" fontFamily="Cinzel,serif" fontSize="13" fill="#D4A017" fontWeight="700" textAnchor="middle">PNB</text>
          <text x="30" y="52" fontFamily="sans-serif" fontSize="5" fill="rgba(255,255,255,0.7)" textAnchor="middle">PQC-Ready</text>
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="tb-welcome">User: <span>admin</span></div>
        <button onClick={onLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', padding: '4px 8px' }}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
