const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '../database');

/**
 * Unified persistence layer for file-based JSON storage.
 */
class DatabaseManager {
    constructor() {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }
    }

    read(filename) {
        const filePath = path.join(DB_DIR, filename);
        if (!fs.existsSync(filePath)) return null;
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
            console.error(`[DB] Error reading ${filename}:`, err);
            return null;
        }
    }

    write(filename, data) {
        const filePath = path.join(DB_DIR, filename);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error(`[DB] Error writing ${filename}:`, err);
            return false;
        }
    }

    listCollections() {
        return fs.readdirSync(DB_DIR).filter(f => f.endsWith('.json'));
    }
}

module.exports = new DatabaseManager();
