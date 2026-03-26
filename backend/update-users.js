const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFile = path.join(__dirname, 'database', 'users.json');
const rawData = fs.readFileSync(usersFile, 'utf8');
const users = JSON.parse(rawData);

users.forEach(u => {
    if (u.username === 'admin') {
        u.password = bcrypt.hashSync('pnb_password_2026', 10);
        console.log(`Updated admin with new hash: ${u.password}`);
    }
});

fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
console.log('users.json updated successfully.');
