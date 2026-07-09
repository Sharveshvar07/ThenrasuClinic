import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Images/loga .jpeg";

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
    color: location.pathname === path ? "#c9a227" : "#333",
    fontWeight: "600",
    fontSize: "16px",
  });

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="logo-container">
            <img src={Logo} alt="Clinic Logo" />
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

          <Link to="/services" style={linkStyle("/services")} onClick={() => setMenuOpen(false)}>
            Our Service
          </Link>

          <Link to="/about" style={linkStyle("/about")} onClick={() => setMenuOpen(false)}>
            About Us
          </Link>

          <Link to="/pricing" style={linkStyle("/pricing")} onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>

          {/* Show Dashboard only when admin is logged in — before Book Appointment */}
          {auth?.user?.role === "hospital" && (
            <Link
              to="/appointments"
              style={{ ...linkStyle("/appointments"), color: "#000" }}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <Link to="/book" className="btn-book" onClick={() => setMenuOpen(false)}>
            Book Appointment
          </Link>

          {/* Show logout only when admin is logged in */}
          {auth?.user?.role === "hospital" && (
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
          )}
        </nav>
      </div>
    </header>
  );
}
