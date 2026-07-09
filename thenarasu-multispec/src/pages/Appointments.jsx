import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments, getAppointmentStats, updateAppointment } from "../api";
import Toast from "../components/Toast";

const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("clinicAuth") || "null");
  } catch {
    return null;
  }
};

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);
  const [toast,        setToast]        = useState(null);
  const [updatingId,   setUpdatingId]   = useState(null);
  const [search,       setSearch]       = useState("");
  const [filter,       setFilter]       = useState("all");

  const auth = useMemo(() => getStoredAuth(), []);
  const role = auth?.user?.role;

  // Redirect non-admin users
  useEffect(() => {
    if (role !== "hospital") {
      navigate("/", { replace: true });
    }
  }, [role, navigate]);

  useEffect(() => {
    document.title = "Appointments Dashboard";
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apts, s] = await Promise.all([getAppointments(), getAppointmentStats()]);
      setAppointments(apts.data);
      setStats(s.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = appointments;
    if (filter !== "all") list = list.filter((a) => (a.status || "pending") === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(q) ||
          a.patientPhone?.includes(q) ||
          a.specialtyName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [appointments, filter, search]);

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { data } = await updateAppointment(id, { status });
      setToast({ message: `Appointment ${status}.`, type: "success" });
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? data : apt)));
      await fetchData();
    } catch (err) {
      setToast({ message: err.response?.data?.error || "Update failed.", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const statusClass = (s) => {
    if (s === "confirmed") return "badge badge-green";
    if (s === "cancelled") return "badge badge-red";
    return "badge badge-yellow";
  };

  if (role !== "hospital") return null;

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <h1>Appointments Dashboard</h1>
          <p>Manage and view all scheduled patient visits.</p>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {stats && (
          <div className="stats-bar">
            <div className="stat"><span>Total</span><strong>{stats.total}</strong></div>
            <div className="stat"><span>Pending</span><strong className="yellow">{stats.pending}</strong></div>
            <div className="stat"><span>Confirmed</span><strong className="green">{stats.confirmed}</strong></div>
            <div className="stat"><span>Cancelled</span><strong className="red">{stats.cancelled}</strong></div>
          </div>
        )}
      </div>

      {/* Search & filter bar */}
      <div className="appt-toolbar">
        <input
          type="search"
          className="appt-search"
          placeholder="🔍 Search by name, phone or specialty…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="appt-filters">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              className={`appt-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className={`apt-card ${apt.status === "cancelled" ? "apt-cancelled" : ""} ${selected?.id === apt.id ? "apt-expanded" : ""}`}
              onClick={() => setSelected(selected?.id === apt.id ? null : apt)}
            >
              <div className="apt-info">
                <div>
                  <strong className="specialty-label">{apt.specialtyName}</strong>
                  <p>{apt.patientName} &bull; Age {apt.patientAge}</p>
                  <p>📞 {apt.patientPhone}</p>
                </div>

                <div>
                  <p><b>Doctor:</b> {apt.doctorName || "N/A"}</p>
                  <p><b>Date:</b> {new Date(apt.appointmentDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <p><b>Time:</b> {apt.appointmentTime}</p>
                </div>
              </div>

              {/* Expanded detail */}
              {selected?.id === apt.id && (
                <div className="apt-expanded-detail">
                  {apt.patientAddress && <p><b>🏠 Address:</b> {apt.patientAddress}</p>}
                  {apt.patientEmail   && <p><b>📧 Email:</b>   {apt.patientEmail}</p>}
                  {apt.reason         && <p><b>💬 Reason:</b>  {apt.reason}</p>}
                  {/* Quick contact buttons */}
                  <div className="apt-contact-btns">
                    <a href={`tel:+91${apt.patientPhone}`} className="apt-call-btn">
                      📞 Call Patient
                    </a>
                    <a
                      href={`https://wa.me/91${apt.patientPhone}?text=${encodeURIComponent(`Hello ${apt.patientName}, your appointment at Dr. Thennarasu Clinic on ${new Date(apt.appointmentDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} at ${apt.appointmentTime} is confirmed. Thank you!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apt-wa-btn"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              )}

              <div className="apt-side">
                <span className={statusClass(apt.status || "pending")}>{apt.status || "pending"}</span>

                {apt.status === "pending" && (
                  <div className="apt-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-confirm"
                      onClick={() => handleStatus(apt.id, "confirmed")}
                      disabled={updatingId === apt.id}
                    >
                      {updatingId === apt.id ? "…" : "Confirm"}
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleStatus(apt.id, "cancelled")}
                      disabled={updatingId === apt.id}
                    >
                      {updatingId === apt.id ? "…" : "Cancel"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}