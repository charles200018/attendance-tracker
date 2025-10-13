import express from "express";
import { openDb } from "../db.js";
const router = express.Router();

// Mark attendance for a class
router.post("/", async (req, res) => {
  const { class_id, date, records } = req.body;
  try {
    const db = await openDb();
    for (const rec of records) {
      await db.run(
        `INSERT INTO attendance (class_id, student_id, date, status)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(class_id, student_id, date) DO UPDATE SET status=excluded.status`,
        [class_id, rec.student_id, date, rec.status]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance for a class (optionally by date)
router.get("/:class_id", async (req, res) => {
  const { class_id } = req.params;
  const { date } = req.query;
  try {
    const db = await openDb();
    let sql =
      `SELECT a.*, s.name as student_name
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE a.class_id = ?`;
    let params = [class_id];
    if (date) {
      sql += " AND a.date = ?";
      params.push(date);
    }
    const rows = await db.all(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;