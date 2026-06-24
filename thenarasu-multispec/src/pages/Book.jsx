import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSpecialities, createAppointment } from "../api";

const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM",
];

export default function Book() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [specialities, setspecialities] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);
  const [errors, setErrors]           = useState({});

  const [form, setForm] = useState({
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

  useEffect(() => {
    document.title = "Book Appointment";
    getSpecialities()
      .then((r) => setspecialities(r.data))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.specialtyId)    e.specialtyId    = "Please select a specialty";
    if (!form.patientName || form.patientName.length < 2) e.patientName = "Name must be at least 2 characters";
    if (!form.patientAge || form.patientAge < 1 || form.patientAge > 120) e.patientAge = "Enter a valid age";
    if (!form.patientGender)  e.patientGender  = "Please select a gender";
    if (!form.patientPhone || form.patientPhone.length < 10) e.patientPhone = "Enter a valid phone number";
    if (!form.appointmentDate) e.appointmentDate = "Please select a date";
    if (!form.appointmentTime) e.appointmentTime = "Please select a time slot";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }

    setSubmitting(true);
    try {
      await createAppointment({
        ...form,
        specialtyId: Number(form.specialtyId),
        patientAge:  Number(form.patientAge),
        patientEmail: form.patientEmail || undefined,
        reason:       form.reason || undefined,
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Booking failed. Please try again.");
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
      <div className="book-header">
        <h1>Book an Appointment</h1>
        <p>Please fill out the form below to schedule your visit.</p>
      </div>

      <form onSubmit={handleSubmit} className="book-form">

        {/* Step 1 - Specialty */}
        <fieldset>
          <legend>1. Select Specialty</legend>
          {loading ? (
            <div className="skeleton-grid small">
              {[1,2,3,4].map(i => <div key={i} className="skeleton-card small"></div>)}
            </div>
          ) : (
            <div className="specialty-select-grid">
              {specialities.filter(s => s.available).map(s => (
                <div
                  key={s.id}
                  className={`specialty-option ${Number(form.specialtyId) === s.id ? "selected" : ""}`}
                  onClick={() => { setForm({ ...form, specialtyId: s.id }); setErrors({ ...errors, specialtyId: "" }); }}
                >
                  <div className="option-icon">{s.icon[0]}</div>
                  <span>{s.name}</span>
                  <small>{s.doctorName}</small>
                </div>
              ))}
            </div>
          )}
          {errors.specialtyId && <p className="error">{errors.specialtyId}</p>}
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
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
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
              <input type="number" name="patientAge" placeholder="30" value={form.patientAge} onChange={handleChange} />
              {errors.patientAge && <p className="error">{errors.patientAge}</p>}
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select name="patientGender" value={form.patientGender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.patientGender && <p className="error">{errors.patientGender}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="patientPhone" placeholder="(555) 123-4567" value={form.patientPhone} onChange={handleChange} />
              {errors.patientPhone && <p className="error">{errors.patientPhone}</p>}
            </div>
            <div className="form-group">
              <label>Email Address (Optional)</label>
              <input type="email" name="patientEmail" placeholder="john@example.com" value={form.patientEmail} onChange={handleChange} />
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