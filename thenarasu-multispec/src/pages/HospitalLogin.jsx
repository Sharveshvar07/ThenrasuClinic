import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import Toast from "../components/Toast";
import "./../css/login.css";

export default function HospitalLogin() {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser({ role: "hospital", staffId, password });
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
          <h2>Hospital Login</h2>
          <p>Access the appointments dashboard.</p>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          <input
            type="text"
            placeholder="Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
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
        </form>
      </div>
    </div>
  );
}
