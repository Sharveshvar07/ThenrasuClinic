import { Link, useLocation } from "react-router-dom";
import Logo from "../Images/Logo.jpeg";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#0d6efd" : "#333",
    fontWeight: "600",
    fontSize: "16px",
  });

  return (
    <header
      style={{
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 30px",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "#000",
            gap: "20px",
          }}
        >
          <img
            src={Logo}
            alt="Clinic Logo"
            style={{
              width: "140px",
              height: "75px",
              objectFit: "contain",
            }}
          />

          <div>
            <h2
              style={{
                margin: 0,
                color: "#0d6efd",
              }}
            >
              Dr. Thennarasu
            </h2>

            <p
              style={{
                margin: 0,
                color: "#666",
                fontSize: "14px",
              }}
            >
              Multispeciality Clinic
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <Link to="/" style={linkStyle("/")}>
            Home
          </Link>

          <Link to="/appointments" style={linkStyle("/appointments")}>
            Appointments
          </Link>

          <Link to="/pricing" style={linkStyle("/pricing")}>
            Pricing
          </Link>

          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color:
                location.pathname === "/login" ||
                location.pathname === "/patient-login" ||
                location.pathname === "/hospital-login"
                  ? "#0d6efd"
                  : "#333",
              fontWeight: "600",
            }}
          >
            Login
          </Link>

          <Link
            to="/book"
            style={{
              background: "#0d6efd",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: "25px",
              fontWeight: "600",
            }}
          >
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}