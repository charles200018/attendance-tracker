import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// List students in a class
router.get("/:class_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM students WHERE class_id = ?",
      [req.params.class_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a student
router.post("/", async (req, res) => {
  const { name, roll, class_id } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO students (name, roll, class_id) VALUES (?, ?, ?)",
      [name, roll, class_id]
    );
    res.json({ id: result.insertId, name, roll, class_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;