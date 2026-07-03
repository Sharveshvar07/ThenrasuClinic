import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Images/Logo.jpeg";

const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("clinicAuth") || "null");
  } catch {
    return null;
  }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth, setAuth] = useState(getStoredAuth());

  useEffect(() => {
    setAuth(getStoredAuth());
  }, [location.pathname]);

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#0d6efd" : "#333",
    fontWeight: "600",
    fontSize: "16px",
  });

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="logo-container">
            <img
              src={Logo}
              alt="Clinic Logo"
            />
          </div>
          <div>
            <h2>Dr. Thennarasu</h2>
            <p>Multispeciality Clinic</p>
          </div>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen((open) => !open)}>
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" style={linkStyle("/")} onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/appointments" style={linkStyle("/appointments")} onClick={() => setMenuOpen(false)}>
            Appointments
          </Link>

          <Link to="/pricing" style={linkStyle("/pricing")} onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>

          <Link to="/book" className="btn-book" onClick={() => setMenuOpen(false)}>
            Book Appointment
          </Link>

          {auth?.user ? (
            <button
              type="button"
              className="nav-logout"
              onClick={() => {
                localStorage.removeItem("clinicAuth");
                setAuth(null);
                setMenuOpen(false);
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={linkStyle("/login")} onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
