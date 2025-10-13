import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import attendanceRoutes from "./routes/attendance.js";
import studentRoutes from "./routes/students.js";
import classRoutes from "./routes/classes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);

app.get("/", (req, res) => {
  res.send("Attendance Tracker Backend is running!");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});