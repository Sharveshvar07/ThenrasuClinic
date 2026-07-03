import { Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../mongodb.js";

const router = Router();

const SLOT_CAPACITIES = {
  // General Medicine
  "09:00 AM - 10:30 AM": 10,
  "10:30 AM - 12:30 PM": 10,
  "02:00 PM - 03:30 PM": 10,
  "03:30 PM - 05:00 PM": 10,
  // Dental Care
  "08:00 AM - 10:00 AM": 6,
  "02:00 PM - 04:00 PM": 6,
  "05:00 PM - 09:00 PM": 8,
};

// ─── HELPER: format a DB row to camelCase ───────────────────────────────────
function fmt(row) {
  return {
    id:              row._id.toString(),
    patientName:     row.patientName,
    patientAge:      row.patientAge,
    patientGender:   row.patientGender,
    patientPhone:    row.patientPhone,
    patientEmail:    row.patientEmail ?? null,
    specialtyId:     row.specialtyId,
    specialtyName:   row.specialtyName ?? null,
    appointmentDate: row.appointmentDate,
    appointmentTime: row.appointmentTime,
    reason:          row.reason ?? null,
    status:          row.status || "pending",
    createdAt:       row.createdAt,
  };
}

const isValidAppointmentId = (id) => ObjectId.isValid(id);

// ─── GET /api/appointments/stats  (MUST come before /:id) ───────────────────
router.get("/stats", async (req, res) => {
  try {
    const appointments = getCollection("appointments");
    const specialities = getCollection("specialities");

    const total = await appointments.countDocuments();
    const pending = await appointments.countDocuments({ status: "pending" });
    const confirmed = await appointments.countDocuments({ status: "confirmed" });
    const cancelled = await appointments.countDocuments({ status: "cancelled" });

    const bySpecialty = await appointments.aggregate([
      { $match: {} },
      { $group: { _id: "$specialtyId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: "specialities",
          localField: "_id",
          foreignField: "_id",
          as: "speciality",
        },
      },
      { $unwind: "$speciality" },
      { $project: { _id: 0, specialtyName: "$speciality.name", count: 1 } },
    ]).toArray();

    res.json({ total, pending, confirmed, cancelled, bySpecialty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/appointments ───────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const appointments = await getCollection("appointments")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const specialityIds = [...new Set(appointments.map((a) => a.specialtyId))].filter(Boolean);
    const specialityDocs = await getCollection("specialities")
      .find({ _id: { $in: specialityIds.map((id) => new ObjectId(id)) } })
      .toArray();

    const specialityMap = specialityDocs.reduce((acc, doc) => {
      acc[doc._id.toString()] = doc.name;
      return acc;
    }, {});

    res.json(
      appointments.map((row) => fmt({
        ...row,
        specialtyName: specialityMap[row.specialtyId] || null,
      }))
    );
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
    const speciality = await getCollection("specialities").findOne({ _id: new ObjectId(specialtyId) });
    if (!speciality) {
      return res.status(400).json({ error: "Specialty not found" });
    }

    const slotCapacity = SLOT_CAPACITIES[appointmentTime];
    if (!slotCapacity) {
      return res.status(400).json({ error: "Invalid appointment time slot" });
    }

    const count = await getCollection("appointments").countDocuments({
      appointmentDate,
      appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (count >= slotCapacity) {
      return res.status(400).json({ error: "This time slot is already full for the selected date." });
    }

    const row = await getCollection("appointments").insertOne({
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail: patientEmail || null,
      specialtyId,
      appointmentDate,
      appointmentTime,
      reason: reason || null,
      status: "pending",
      createdAt: new Date(),
    });

    const full = await getCollection("appointments").findOne({ _id: row.insertedId });
    res.status(201).json(fmt({ ...full, specialtyName: speciality.name }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /api/appointments/:id ───────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  if (!isValidAppointmentId(req.params.id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const row = await getCollection("appointments").findOne({ _id: new ObjectId(req.params.id) });
    if (!row) return res.status(404).json({ error: "Appointment not found" });

    const speciality = await getCollection("specialities").findOne({ _id: new ObjectId(row.specialtyId) });
    res.json(fmt({ ...row, specialtyName: speciality?.name || null }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── PATCH /api/appointments/:id ─────────────────────────────────────────────
router.patch("/:id", async (req, res) => {
  if (!isValidAppointmentId(req.params.id)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedResult = await getCollection("appointments").findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    const updated = updatedResult?.value ?? updatedResult;
    if (!updated) return res.status(404).json({ error: "Appointment not found" });

    const speciality = await getCollection("specialities").findOne({ _id: new ObjectId(updated.specialtyId) });
    res.json(fmt({ ...updated, specialtyName: speciality?.name || null }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;