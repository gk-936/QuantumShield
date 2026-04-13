const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Import Routes
const scanRoutes = require('./routes/scan');
const schedulerRoutes = require('./routes/scheduler');
const mobileRoutes = require('./routes/mobile');
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth');
const remediationRoutes = require('./routes/remediation');
const { initScheduler } = require('./services/scheduler');

// Start Automation Scheduler (Daily 00:00)
initScheduler();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'QuantumShield AI Backend v1.0 Active', 
    pqc_engine: 'Ready',
    timestamp: new Date().toISOString() 
  });
});

// Use Routes
app.use('/api/scan', scanRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/mobile', mobileRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/remediation', remediationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Qubit-Guard Backend is up!
  📡 Port: ${PORT}
  🛡️ PQC Scanning Engine: ONLINE
  🧠 AI Analysis Service: ONLINE
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try changing the PORT in .env`);
  } else {
    console.error('❌ Server error:', err);
  }
});
