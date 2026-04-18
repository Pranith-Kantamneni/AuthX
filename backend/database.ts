import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database;

export async function setupDb() {
  db = await open({
    filename: './auth.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      hash_value TEXT,
      temporal_salt TEXT,
      random_salt TEXT,
      algorithm TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      failed_attempts INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      algorithm TEXT,
      hash_time_ms REAL,
      verify_time_ms REAL,
      salt_gen_time_ms REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
