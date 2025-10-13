import express from "express";
import { pool } from "../db.js";
const router = express.Router();

// List classes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM classes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a class
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO classes (name) VALUES (?)",
      [name]
    );
    res.json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;