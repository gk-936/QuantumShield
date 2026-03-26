const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../database', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'pnc_secret_key_2026_top_secret';

// Helper to read users
const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Login Route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, user: { username: user.username, role: user.role } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Verify Token (Used by ProtectedRoute)
router.get('/verify', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ success: false });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false });
        res.json({ success: true, user: decoded });
    });
});

module.exports = router;
