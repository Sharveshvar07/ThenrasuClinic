import { Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../mongodb.js";
import { sendSMS } from "../sms.js";

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
    patientGender:   row.patientGender   ?? null,
    patientPhone:    row.patientPhone,
    patientEmail:    row.patientEmail    ?? null,
    patientAddress:  row.patientAddress  ?? null,
    specialtyId:     row.specialtyId,
    specialtyName:   row.specialtyName   ?? null,
    doctorName:      row.doctorName      ?? null,
    appointmentDate: row.appointmentDate,
    appointmentTime: row.appointmentTime,
    reason:          row.reason          ?? null,
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
      patientEmail, patientAddress,
      specialtyId, appointmentDate, appointmentTime, reason,
    } = req.body;

    // Validate mandatory patient fields
    if (!patientName || String(patientName).trim().length < 2) {
      return res.status(400).json({ error: "Patient name is required (min 2 characters)" });
    }
    if (!patientPhone || !/^\d{10}$/.test(patientPhone)) {
      return res.status(400).json({ error: "A valid 10-digit phone number is required" });
    }
    if (!patientAge || Number(patientAge) < 1 || Number(patientAge) > 120) {
      return res.status(400).json({ error: "A valid age (1-120) is required" });
    }
    if (!patientAddress || String(patientAddress).trim().length < 5) {
      return res.status(400).json({ error: "Patient address is required" });
    }

    if (!reason || String(reason).trim().length === 0) {
      return res.status(400).json({ error: "Reason for visit is required" });
    }

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

    const generalOptions = ['family medicine', 'preventive care', 'pediatric care', "women's health"];
    const dentalOptions  = ['dental care', 'facial care', 'dental implants'];
    const specialityName = speciality.name?.toLowerCase?.();
    const fallbackDoctor = generalOptions.includes(specialityName)
      ? 'Dr. Kavi Priya'
      : dentalOptions.includes(specialityName)
      ? 'Dr. Thennarasu'
      : 'Dr. Thennarasu';

    const doctorName = speciality.doctor_name || speciality.doctorName || fallbackDoctor;

    const row = await getCollection("appointments").insertOne({
      patientName:     patientName.trim(),
      patientAge:      Number(patientAge),
      patientGender:   patientGender   || null,
      patientPhone,
      patientEmail:    patientEmail    ? patientEmail.trim().toLowerCase() : null,
      patientAddress:  patientAddress.trim(),
      specialtyId,
      specialtyName:   speciality.name,
      doctorName,
      appointmentDate,
      appointmentTime,
      reason:          reason?.trim()  || null,
      status:          "pending",
      createdAt:       new Date(),
    });

    const full = await getCollection("appointments").findOne({ _id: row.insertedId });

    // Send SMS to admin with appointment details
    const adminPhone = process.env.ADMIN_PHONE || "9092663216";
    const adminMessage = `New booking at Dr. Thennarasu Clinic!
Patient: ${patientName.trim()} (${patientAge}, ${patientGender || 'N/A'})
Phone: ${patientPhone}
Specialty: ${speciality.name}
Doctor: ${doctorName}
Date: ${appointmentDate}
Time: ${appointmentTime}
Reason: ${reason?.trim() || 'None'}`;
    
    sendSMS(adminPhone, adminMessage).catch(err => console.error("Error sending booking SMS to admin:", err));

    res.status(201).json(fmt(full));
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
    const specialtyName = speciality?.name || updated.specialtyName || "General Care";

    // Send status update SMS to patient
    if (status === "confirmed" || status === "cancelled") {
      const patientPhone = updated.patientPhone;
      let patientMessage = "";
      if (status === "confirmed") {
        patientMessage = `Dear ${updated.patientName}, your appointment request at Dr. Thennarasu Clinic has been CONFIRMED.
Specialty: ${specialtyName}
Doctor: ${updated.doctorName || "Doctor"}
Date: ${updated.appointmentDate}
Time: ${updated.appointmentTime}
Status: Confirmed. Thank you!`;
      } else if (status === "cancelled") {
        patientMessage = `Dear ${updated.patientName}, your appointment request at Dr. Thennarasu Clinic has been CANCELLED.
Specialty: ${specialtyName}
Doctor: ${updated.doctorName || "Doctor"}
Date: ${updated.appointmentDate}
Time: ${updated.appointmentTime}
Status: Cancelled.`;
      }

      sendSMS(patientPhone, patientMessage).catch(err => console.error("Error sending status update SMS to patient:", err));
    }

    res.json(fmt({ ...updated, specialtyName: specialtyName }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;