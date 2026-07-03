import { Link } from "react-router-dom";
import "./../css/login.css";

export default function Login() {
  return (
    <div className="login-selection">
      <div className="login-container">
        <h1 className="login-title">Choose Login</h1>
        <p className="login-subtitle">Select your login type</p>

        <div className="login-boxes">
          <Link to="/patient-login" className="login-card">
            <div className="login-icon">👤</div>
            <h2>Patient Login</h2>
            <p>Book appointments and view reports.</p>
          </Link>

          <Link to="/hospital-login" className="login-card">
            <div className="login-icon">🏥</div>
            <h2>Hospital Login</h2>
            <p>Manage appointments and patients.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
