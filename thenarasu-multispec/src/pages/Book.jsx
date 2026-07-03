import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSpecialities, getAppointments, createAppointment } from "../api";
import SpecialtyIcon from "../components/SpecialtyIcon";
import Toast from "../components/Toast";

const TIME_SLOTS = [
  { value: "09:00 AM - 10:30 AM", label: "09:00 AM - 10:30 AM", capacity: 10 },
  { value: "10:30 AM - 12:30 PM", label: "10:30 AM - 12:30 PM", capacity: 10 },
  { value: "02:00 PM - 03:30 PM", label: "02:00 PM - 03:30 PM", capacity: 10 },
  { value: "03:30 PM - 05:00 PM", label: "03:30 PM - 05:00 PM", capacity: 10 },
];

const DENTAL_TIME_SLOTS = [
  { value: "08:00 AM - 10:00 AM", label: "08:00 AM - 10:00 AM", capacity: 6 },
  { value: "02:00 PM - 04:00 PM", label: "02:00 PM - 04:00 PM", capacity: 6 },
  { value: "05:00 PM - 09:00 PM", label: "05:00 PM - 09:00 PM", capacity: 8 },
];

export default function Book() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getStoredAuth = () => {
    try {
      return JSON.parse(localStorage.getItem("clinicAuth") || "null");
    } catch {
      return null;
    }
  };

  const [specialities, setspecialities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [success, setSuccess]           = useState(false);
  const [errors, setErrors]             = useState({});
  const [toast, setToast]               = useState(null);

  const [form, setForm] = useState({
    department:      "",
    specialtyId:     searchParams.get("specialty") || "",
    patientName:     "",
    patientAge:      "",
    patientGender:   "",
    patientPhone:    "",
    patientEmail:    "",
    appointmentDate: "",
    appointmentTime: "",
    reason:          "",
  });

  // Prefill patient info from logged in user (if any)
  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.user) {
      setForm((prev) => ({
        ...prev,
        patientName: prev.patientName || auth.user.name || "",
        patientEmail: prev.patientEmail || auth.user.email || "",
      }));
    }
  }, []);

  const isWomensHealthSelected = useMemo(() => {
    const selected = specialities.find((s) => form.specialtyId === s._id);
    return selected?.name?.toLowerCase().replace(/['’]/g, "") === "womens health";
  }, [specialities, form.specialtyId]);

  useEffect(() => {
    if (isWomensHealthSelected) {
      setForm((prev) => ({ ...prev, patientGender: "Female" }));
    }
  }, [isWomensHealthSelected]);

  useEffect(() => {
    document.title = "Book Appointment";
    Promise.all([getSpecialities(), getAppointments()])
      .then(([specRes, apptRes]) => {
        setspecialities(specRes.data);
        setAppointments(apptRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const bookedCounts = useMemo(() => {
    if (!form.appointmentDate) return {};
    return appointments
      .filter((a) => a.appointmentDate === form.appointmentDate && a.status !== "cancelled")
      .reduce((acc, appointment) => {
        acc[appointment.appointmentTime] = (acc[appointment.appointmentTime] || 0) + 1;
        return acc;
      }, {});
  }, [appointments, form.appointmentDate]);

  const validate = () => {
  const e = {};

  if (!form.specialtyId)
    e.specialtyId = "Please select a specialty";

  if (!form.patientName || form.patientName.length < 2)
    e.patientName = "Name must be at least 2 characters";

  if (!form.patientAge || form.patientAge < 1 || form.patientAge > 120)
    e.patientAge = "Enter a valid age";

  if (!form.patientGender)
    e.patientGender = "Please select a gender";

  // Phone — required, exactly 10 digits
  if (!form.patientPhone) {
    e.patientPhone = "Phone number is required";
  } else if (!/^\d{10}$/.test(form.patientPhone)) {
    e.patientPhone = "Phone number must be exactly 10 digits";
  }

  // Email — now mandatory + format check
  if (!form.patientEmail) {
    e.patientEmail = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.patientEmail)) {
    e.patientEmail = "Enter a valid email address";
  }

  if (!form.appointmentDate)
    e.appointmentDate = "Please select a date";

  if (!form.appointmentTime)
    e.appointmentTime = "Please select a time slot";

  return e;
};

  
  const handleChange = (e) => {
    if (e.target.name === "appointmentDate") {
      setForm({ ...form, appointmentDate: e.target.value, appointmentTime: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const isSlotFull = (slot) => bookedCounts[slot.value] >= slot.capacity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }

    setSubmitting(true);
    try {
      const auth = getStoredAuth();
      const payload = {
        ...form,
        specialtyId: form.specialtyId,
        patientAge: Number(form.patientAge),
        patientEmail: (auth?.user?.email || form.patientEmail)?.trim?.().toLowerCase?.() || undefined,
        patientName: form.patientName || auth?.user?.name || undefined,
        reason: form.reason || undefined,
      };

      const { data } = await createAppointment(payload);
      setAppointments((prev) => [...prev, data]);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message = err?.response?.data?.error || "Booking failed. Please try again.";
      setToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="confirmation">
        <div className="confirmation-card">
          <div className="check-icon">&#10003;</div>
          <h2>Booking Confirmed!</h2>
          <p>Thank you for choosing our Clinic. We have received your appointment request.</p>
          <div className="confirmation-buttons">
            <button onClick={() => navigate("/appointments")} className="btn-outline">View Appointments</button>
            <button onClick={() => navigate("/")} className="btn-primary">Return Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="book-header">
        <h1>Book an Appointment</h1>
        <p>Please fill out the form below to schedule your visit.</p>
      </div>

      <form onSubmit={handleSubmit} className="book-form">

       <fieldset>
  <legend>1. Select Specialty</legend>

  {loading ? (
    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "10px" }}>Loading...</p>
  ) : (
  <>
  {/* Step 1 — Department */}
  <p style={{ margin: "12px 0 10px", fontWeight: 600, fontSize: "14px", color: "#475569" }}>
    Choose Department:
  </p>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
    {[
      { key: "general", label: "General Medicine", icon: "family" },
      { key: "dental",  label: "Dental",           icon: "dental"  },
    ].map(dept => {
      const isActive = form.department === dept.key;
      return (
        <div
          key={dept.key}
          onClick={() => {
            setForm({ ...form, department: dept.key, specialtyId: "", appointmentTime: "" });
            setErrors({ ...errors, specialtyId: "" });
          }}
          style={{
            background: isActive ? "#eff6ff" : "#fff",
            border: isActive ? "2px solid #2563eb" : "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px 12px",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", color: isActive ? "#2563eb" : "#e8a020" }}>
            <SpecialtyIcon name={dept.icon} />
          </div>
          <span style={{ display: "block", fontWeight: "700", fontSize: "14px", color: isActive ? "#2563eb" : "#1a3c5e" }}>
            {dept.label}
          </span>
        </div>
      );
    })}
  </div>

  {/* Step 2 — Sub-specialty */}
  {form.department && (() => {
    const DEPT_SPECIALTIES = {
      general: ["Family Medicine", "Preventive Care", "Pediatric Care", "Women's Health"],
      dental:  ["Dental Care", "Facial Care", "Dental Implants"],
    };
    const allowed = DEPT_SPECIALTIES[form.department];
    const filtered = specialities.filter(s => s.available && allowed.some(a => s.name.toLowerCase().includes(a.toLowerCase())));

    return (
      <>
        <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: "14px", color: "#475569" }}>
          Choose Sub-Specialty:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
          {filtered.map(s => {
            const isSelected = form.specialtyId === s._id;
            return (
              <div
                key={s._id}
                onClick={() => { setForm({ ...form, specialtyId: s._id }); setErrors({ ...errors, specialtyId: "" }); }}
                style={{
                  background: isSelected ? "#eff6ff" : "#fff",
                  border: isSelected ? "2px solid #2563eb" : "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "14px 10px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px", color: isSelected ? "#2563eb" : "#e8a020" }}>
                  <SpecialtyIcon name={s.name} />
                </div>
                <span style={{ display: "block", fontWeight: "600", fontSize: "13px", color: isSelected ? "#2563eb" : "#1a3c5e" }}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </>
    );
  })()}

  {errors.specialtyId && (
    <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
      {errors.specialtyId}
    </p>
  )}
  </>
  )}
</fieldset>

        {/* Step 2 - Date & Time */}
        <fieldset>
          <legend>2. Date &amp; Time</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.appointmentDate && <p className="error">{errors.appointmentDate}</p>}
            </div>
            <div className="form-group">
              <label>Preferred Time *</label>
              <select name="appointmentTime" value={form.appointmentTime} onChange={handleChange}>
                <option value="">Select a time slot</option>
                {(form.department === "dental" ? DENTAL_TIME_SLOTS : TIME_SLOTS).map((slot) => (
                  <option key={slot.value} value={slot.value} disabled={isSlotFull(slot)}>
                    {slot.label} {isSlotFull(slot) ? "(Full)" : `(${bookedCounts[slot.value] || 0}/${slot.capacity})`}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && <p className="error">{errors.appointmentTime}</p>}
            </div>
          </div>
        </fieldset>

        {/* Step 3 - Patient Details */}
        <fieldset>
          <legend>3. Patient Details</legend>

          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="patientName" placeholder="John Doe" value={form.patientName} onChange={handleChange} />
            {errors.patientName && <p className="error">{errors.patientName}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input type="number" name="patientAge" placeholder="00" value={form.patientAge} onChange={handleChange} />
              {errors.patientAge && <p className="error">{errors.patientAge}</p>}
            </div>
            <div className="form-group">
              <label>Gender *</label>
              {isWomensHealthSelected ? (
                <input type="text" value="Female" disabled style={{ backgroundColor: "#f8fafc", color: "#111827" }} />
              ) : (
                <select name="patientGender" value={form.patientGender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              )}
              {errors.patientGender && <p className="error">{errors.patientGender}</p>}
            </div>
          </div>

          <div className="form-row">
  <div className="form-group">
    <label>Phone Number *</label>
    <input
      type="tel"
      name="patientPhone"
      placeholder="Enter 10-digit number"
      value={form.patientPhone}
      maxLength={10}
      onChange={(e) => {
        // Allow only digits, max 10
        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
        setForm({ ...form, patientPhone: val });
        if (val.length === 0) {
          setErrors({ ...errors, patientPhone: "Phone number is required." });
        } else if (val.length < 10) {
          setErrors({ ...errors, patientPhone: "Phone number must be exactly 10 digits." });
        } else {
          setErrors({ ...errors, patientPhone: "" });
        }
      }}
      style={{
        border: errors.patientPhone ? "1.5px solid #ef4444" : "1.5px solid #d1d5db",
      }}
    />
    {errors.patientPhone && <p className="error">{errors.patientPhone}</p>}
  </div>

  <div className="form-group">
    <label>Email Address *</label>
    <input
      type="email"
      name="patientEmail"
      placeholder="john@example.com"
      value={form.patientEmail}
      onChange={(e) => {
        const val = e.target.value;
        setForm({ ...form, patientEmail: val });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) {
          setErrors({ ...errors, patientEmail: "Email address is required." });
        } else if (!emailRegex.test(val)) {
          setErrors({ ...errors, patientEmail: "Enter a valid email address." });
        } else {
          setErrors({ ...errors, patientEmail: "" });
        }
      }}
      style={{
        border: errors.patientEmail ? "1.5px solid #ef4444" : "1.5px solid #d1d5db",
      }}
    />
    {errors.patientEmail && <p className="error">{errors.patientEmail}</p>}
  </div>
</div>

          <div className="form-group">
            <label>Reason for Visit (Optional)</label>
            <textarea name="reason" placeholder="Briefly describe your symptoms..." value={form.reason} onChange={handleChange} rows={4} />
          </div>
        </fieldset>

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? "Confirming Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}