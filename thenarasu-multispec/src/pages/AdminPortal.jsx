import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import Toast from "../components/Toast";

/**
 * AdminPortal — staff-only login.
 * This page is intentionally kept minimal and is NOT linked from any public page.
 * Access URL: /portal/tc-admin-access
 */
export default function AdminPortal() {
  const navigate = useNavigate();
  const [staffId, setStaffId]   = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [showPwd, setShowPwd]   = useState(false);

  // Disguise page title so it doesn't hint at an admin panel
  document.title = "Staff Portal";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser({ role: "hospital", staffId, password });
      localStorage.setItem("clinicAuth", JSON.stringify({ token: data.token, user: data.user }));
      setToast({ message: "Access granted", type: "success" });
      setTimeout(() => navigate("/appointments"), 700);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-portal-wrapper">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-portal-card">
        {/* Subtle lock icon */}
        <div className="admin-portal-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h1 className="admin-portal-title">Staff Portal</h1>
        <p className="admin-portal-sub">Authorised personnel only</p>

        <form className="admin-portal-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="staffId">Staff ID</label>
            <input
              id="staffId"
              type="text"
              placeholder="Enter your staff ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="staffPwd">Password</label>
            <div className="admin-pwd-wrap">
              <input
                id="staffPwd"
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPwd ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-portal-btn" disabled={loading}>
            {loading ? (
              <span className="admin-btn-loading">
                <span className="admin-spinner" /> Authenticating…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="admin-portal-footer">
          This is a restricted area. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
}
