import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbPath = path.join(dataDir, 'chat.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
`);

export function saveMessage(msg: {
  id: string;
  role: string;
  content: string;
  created_at: number;
}) {
  db.prepare(
    `INSERT INTO messages (id, role, content, created_at) VALUES (@id, @role, @content, @created_at)`
  ).run(msg);
}

export function getMessages(limit = 100) {
  return db
    .prepare(
      `SELECT id, role, content, created_at FROM messages ORDER BY created_at ASC LIMIT ?`
    )
    .all(limit);
}

export default db;