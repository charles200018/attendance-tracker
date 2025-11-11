import express from "express";
import { openDb } from "../db.js";
const router = express.Router();

// List classes
router.get("/", async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all("SELECT * FROM classes");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a class
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const db = await openDb();
    const result = await db.run(
      "INSERT INTO classes (name) VALUES (?)",
      [name]
    );
    res.json({ id: result.lastID, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
