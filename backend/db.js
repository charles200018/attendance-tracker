import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the SQLite database (creates file if it doesn't exist)
export const openDb = async () =>
  open({
    filename: './attendance.db',
    driver: sqlite3.Database,
  });