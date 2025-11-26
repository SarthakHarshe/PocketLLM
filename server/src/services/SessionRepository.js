const Database = require('better-sqlite3');
const path = require('path');

class SessionRepository {
    constructor() {
        this.db = new Database(path.join(__dirname, '../../pocket_llm.db'));
        this.initialize();
    }

    initialize() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        title TEXT,
        created_at INTEGER,
        updated_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        role TEXT,
        content TEXT,
        timestamp INTEGER,
        FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE
      );
    `);
    }

    createSession(id, title = 'New Chat') {
        const stmt = this.db.prepare('INSERT INTO sessions (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)');
        const now = Date.now();
        stmt.run(id, title, now, now);
        return { id, title, created_at: now, updated_at: now };
    }

    getSession(id) {
        return this.db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
    }

    getAllSessions() {
        const stmt = this.db.prepare('SELECT * FROM sessions ORDER BY created_at DESC');
        return stmt.all();
    }

    addMessage(sessionId, role, content) {
        const stmt = this.db.prepare('INSERT INTO messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)');
        const now = Date.now();
        stmt.run(sessionId, role, content, now);

        // Update session timestamp
        this.db.prepare('UPDATE sessions SET updated_at = ? WHERE id = ?').run(now, sessionId);

        return { role, content, timestamp: now };
    }

    getMessages(sessionId) {
        return this.db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY id ASC').all(sessionId);
    }

    deleteSession(id) {
        this.db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
    }
}

module.exports = new SessionRepository();
