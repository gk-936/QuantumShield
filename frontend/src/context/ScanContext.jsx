import React, { createContext, useContext, useState, useEffect } from 'react';

const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [activeScanId, setActiveScanId] = useState(localStorage.getItem('active_scan_id') || '');
  const [activeScanMetadata, setActiveScanMetadata] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history on load
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/scan/history');
      const json = await res.json();
      if (json.success) {
        setHistory(json.data);
        if (activeScanId) {
          const meta = json.data.find(s => s.id === activeScanId);
          setActiveScanMetadata(meta || null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeScanId]);

  const switchScan = (id) => {
    setActiveScanId(id);
    if (id) {
      localStorage.setItem('active_scan_id', id);
    } else {
      localStorage.removeItem('active_scan_id');
      setActiveScanMetadata(null);
    }
  };

  return (
    <ScanContext.Provider value={{
      activeScanId,
      activeScanMetadata,
      history,
      switchScan,
      fetchHistory,
      isHistoryMode: !!activeScanId
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);
