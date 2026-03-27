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

export const searchMobileApps = (query) => api.get('/mobile/search', { params: { query } });

export const scanMobileApp = (data) => api.post('/mobile/scan', data);

export const getDashboardData = () => api.get('/data/dashboard');
export const getInventoryData = () => api.get('/data/inventory');
export const getCbomData = () => api.get('/data/cbom');

export const login = (credentials) => api.post('/auth/login', credentials);
export const verifyToken = () => api.get('/auth/verify');

export const generateRemediation = (findings) => api.post('/remediation/generate', { findings });

export const chatWithExpert = (message, history) => api.post('/remediation/chat', { message, history });
export const sendEmailReport = (data) => api.post('/data/report/send', data);

export default api;
