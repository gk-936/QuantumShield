import axios from 'axios';

const API_BASE_URL = 'http://localhost:5006/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = () => api.get('/health');

export const runTriadScan = (data) => api.post('/scan/triad', data);

export const analyzeVulnerabilities = (data) => api.post('/analyze', { data });

export const createSchedule = (data) => api.post('/scheduler/create', data);

export const listSchedules = () => api.get('/scheduler/list');

export const searchMobileApps = () => api.get('/mobile/search');

export const scanMobileApp = (data) => api.post('/mobile/scan', data);

export default api;
