import { useEffect, useState } from "react";
import { getAppointments, getAppointmentStats, updateAppointment } from "../api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);

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

  const handleStatus = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      fetchData();
    } catch (err) {
      alert("Update failed.");
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
          <p>Manage and view all scheduled visits.</p>
        </div>

        {stats && (
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
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found. <a href="/book">Book one now.</a></p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(apt => (
            <div key={apt.id} className="apt-card" onClick={() => setSelected(selected?.id === apt.id ? null : apt)}>
              <div className="apt-info">
                <div>
                  <strong className="specialty-label">{apt.specialtyName}</strong>
                  <p>{apt.patientName} &bull; Age {apt.patientAge} &bull; {apt.patientGender}</p>
                  <p>{apt.patientPhone}</p>
                </div>
                <div>
                  <p><b>Date:</b> {new Date(apt.appointmentDate).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</p>
                  <p><b>Time:</b> {apt.appointmentTime}</p>
                </div>
                <div>
                  <span className={statusClass(apt.status)}>{apt.status}</span>
                </div>
              </div>

              {apt.status === "pending" && (
                <div className="apt-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn-confirm" onClick={() => handleStatus(apt.id, "confirmed")}>Confirm</button>
                  <button className="btn-cancel"  onClick={() => handleStatus(apt.id, "cancelled")}>Cancel</button>
                </div>
              )}

              {/* Detail panel */}
              {selected?.id === apt.id && (
                <div className="apt-detail">
                  <p><b>Phone:</b> {apt.patientPhone}</p>
                  {apt.patientEmail && <p><b>Email:</b> {apt.patientEmail}</p>}
                  {apt.reason && <p><b>Reason:</b> {apt.reason}</p>}
                  <p><b>Booked on:</b> {new Date(apt.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}