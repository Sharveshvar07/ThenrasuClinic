import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import Toast from "../components/Toast";
import "./../css/login.css";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser({ role: "patient", email, password });
      localStorage.setItem(
        "clinicAuth",
        JSON.stringify({ token: data.token, user: data.user })
      );
      setToast({ message: "Login successful", type: "success" });
      setTimeout(() => navigate("/appointments"), 700);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-selection">
      <div className="login-container">
        <form
          className="login-form"
          onSubmit={handleSubmit}
          style={{ maxWidth: "420px", margin: "0 auto" }}
        >
          <h2>Patient Login</h2>
          <p>Access booking and appointment services.</p>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="auth-switch" style={{ marginTop: "18px" }}>
            New patient? <Link to="/patient-register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}