import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ onLogout }) => {
  const location = useLocation();
  
  const pageTitles = {
    '/dashboard': 'Home Dashboard',
    '/inventory': 'Asset Inventory',
    '/discovery': 'Asset Discovery',
    '/cbom': 'CBOM (Crypto Bill of Materials)',
    '/posture': 'Posture of PQC',
    '/rating': 'Cyber Rating',
    '/reporting': 'Reporting & Automation',
    '/triad': 'Triad PQC Scanner',
    '/remediation': 'AI Auto-Remediation',
    '/qday': 'Q-Day HNDL Simulator',
    '/mobile': 'Mobile App Scanning'
  };

  const currentTitle = pageTitles[location.pathname] || 'QuantumShield.AI';

  return (
    <div id="app">
      <div className="hk-bg"></div>
      <Sidebar />
      <div id="main">
        <Header title={currentTitle} onLogout={onLogout} />
        <div id="content">
          <Outlet />
        </div>
        <div id="footer-bar">
          <span>15/03/2026</span>
          <span>PSB Hackathon 2026 — QuantumShield.AI by trust_x | Amrita Vishwa Vidyapeetham</span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default Layout;
