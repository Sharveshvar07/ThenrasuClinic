import { useEffect, useState, useMemo } from "react";
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
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);
  const [toast, setToast]               = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);
  const auth = useMemo(() => getStoredAuth(), []);
  const role = auth?.user?.role;
  const patientEmail = auth?.user?.email?.toLowerCase?.();

  useEffect(() => {
    document.title = "Appointments";
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

  const filteredAppointments = useMemo(() => {
    if (role === "hospital") return appointments;
    if (role === "patient") {
      return appointments.filter((appointment) =>
        appointment.patientEmail?.toLowerCase?.() === patientEmail
      );
    }
    return appointments;
  }, [appointments, role, patientEmail]);

  const handleStatus = async (id, status) => {
    if (role !== "hospital") return;

    setUpdatingId(id);
    try {
      const { data } = await updateAppointment(id, { status });
      setToast({ message: `Appointment ${status}.`, type: "success" });
      setAppointments((prev) => prev.map((apt) => apt.id === id ? data : apt));
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

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <h1>Appointments Dashboard</h1>
          <p>{role === "hospital" ? "Manage and view all scheduled visits." : "View your appointment requests and current status."}</p>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {role === "hospital" && stats && (
          <div className="stats-bar">
            <div className="stat"><span>Total</span><strong>{stats.total}</strong></div>
            <div className="stat"><span>Pending</span><strong className="yellow">{stats.pending}</strong></div>
            <div className="stat"><span>Confirmed</span><strong className="green">{stats.confirmed}</strong></div>
            <div className="stat"><span>Cancelled</span><strong className="red">{stats.cancelled}</strong></div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card"></div>)}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found. <a href="/book">Book one now.</a></p>
        </div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className={`apt-card ${apt.status === "cancelled" ? "apt-cancelled" : ""}`}
              onClick={() => setSelected(selected?.id === apt.id ? null : apt)}
            >
              <div className="apt-info">
                <div>
                  <strong className="specialty-label">{apt.specialtyName}</strong>
                  {role === "hospital" ? (
                    <>
                      <p>{apt.patientName} • Age {apt.patientAge} • {apt.patientGender}</p>
                      <p>{apt.patientPhone}</p>
                    </>
                  ) : (
                    <>
                      <p>{new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • {apt.appointmentTime}</p>
                    </>
                  )}
                </div>

                {role === "hospital" && (
                  <div>
                    <p><b>Date:</b> {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p><b>Time:</b> {apt.appointmentTime}</p>
                  </div>
                )}

              </div>

              <div className="apt-side">
                <span className={statusClass(apt.status || "pending")}>{apt.status || "pending"}</span>

                {role === "hospital" && apt.status === "pending" && (
                  <div className="apt-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-confirm"
                      onClick={() => handleStatus(apt.id, "confirmed")}
                      disabled={updatingId === apt.id}
                    >
                      {updatingId === apt.id ? "Updating..." : "Confirm"}
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => handleStatus(apt.id, "cancelled")}
                      disabled={updatingId === apt.id}
                    >
                      {updatingId === apt.id ? "Updating..." : "Cancel"}
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