import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const setup = async () => {
  const db = await open({
    filename: './attendance.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      roll TEXT,
      class_id INTEGER,
      FOREIGN KEY (class_id) REFERENCES classes(id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER,
      student_id INTEGER,
      date TEXT,
      status TEXT DEFAULT 'present',
      UNIQUE(class_id, student_id, date),
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);

  console.log("Database initialized!");
  await db.close();
};

setup();