import { Router } from "express";
import pool from "../db.js";

const router = Router();

// ─── HELPER: format a DB row to camelCase ───────────────────────────────────
function fmt(row) {
  return {
    id:              row.id,
    patientName:     row.patient_name,
    patientAge:      row.patient_age,
    patientGender:   row.patient_gender,
    patientPhone:    row.patient_phone,
    patientEmail:    row.patient_email ?? null,
    specialtyId:     row.specialty_id,
    specialtyName:   row.specialty_name ?? row.specialtyName,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    reason:          row.reason ?? null,
    status:          row.status,
    createdAt:       row.created_at,
  };
}

// ─── GET /api/appointments/stats  (MUST come before /:id) ───────────────────
router.get("/stats", async (req, res) => {
  try {
    const { rows: [stats] } = await pool.query(`
      SELECT
        COUNT(*)::int                                       AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int    AS pending,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int  AS confirmed,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int  AS cancelled
      FROM appointments
    `);

    const { rows: bySpecialty } = await pool.query(`
      SELECT s.name AS "specialtyName", COUNT(a.id)::int AS count
      FROM appointments a
      JOIN specialties s ON s.id = a.specialty_id
      GROUP BY s.name
      ORDER BY count DESC
    `);

    res.json({ ...stats, bySpecialty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/appointments ───────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, s.name AS specialty_name
      FROM appointments a
      JOIN specialties s ON s.id = a.specialty_id
      ORDER BY a.created_at DESC
    `);
    res.json(rows.map(fmt));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /api/appointments ──────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      patientName, patientAge, patientGender, patientPhone,
      patientEmail, specialtyId, appointmentDate, appointmentTime, reason,
    } = req.body;

    // Check specialty exists
    const spec = await pool.query("SELECT id FROM specialties WHERE id=$1", [specialtyId]);
    if (spec.rows.length === 0) {
      return res.status(400).json({ error: "Specialty not found" });
    }

    const { rows: [row] } = await pool.query(`
      INSERT INTO appointments
        (patient_name, patient_age, patient_gender, patient_phone, patient_email,
         specialty_id, appointment_date, appointment_time, reason, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
      RETURNING *
    `, [patientName, patientAge, patientGender, patientPhone,
        patientEmail || null, specialtyId, appointmentDate, appointmentTime, reason || null]);

    // Attach specialty name
    const { rows: [full] } = await pool.query(`
      SELECT a.*, s.name AS specialty_name
      FROM appointments a JOIN specialties s ON s.id=a.specialty_id
      WHERE a.id=$1
    `, [row.id]);

    res.status(201).json(fmt(full));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/appointments/:id ───────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const { rows: [row] } = await pool.query(`
      SELECT a.*, s.name AS specialty_name
      FROM appointments a JOIN specialties s ON s.id=a.specialty_id
      WHERE a.id=$1
    `, [req.params.id]);

    if (!row) return res.status(404).json({ error: "Appointment not found" });
    res.json(fmt(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── PATCH /api/appointments/:id ─────────────────────────────────────────────
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { rows: [updated] } = await pool.query(
      "UPDATE appointments SET status=$1 WHERE id=$2 RETURNING *",
      [status, req.params.id]
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    const { rows: [full] } = await pool.query(`
      SELECT a.*, s.name AS specialty_name
      FROM appointments a JOIN specialties s ON s.id=a.specialty_id
      WHERE a.id=$1
    `, [updated.id]);

    res.json(fmt(full));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;