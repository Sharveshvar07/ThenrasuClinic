import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        icon,
        doctor_name  AS "doctorName",
        available
      FROM specialities
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ specialities ERROR:", err.message);  // shows in terminal
    res.status(500).json({ error: err.message });          // shows in browser
  }
});

export default router;