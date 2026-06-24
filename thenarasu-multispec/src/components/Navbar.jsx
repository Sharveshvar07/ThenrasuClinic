import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../Images/Logo.jpeg";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 25px",
        boxSizing: "border-box",
      }}
    >
        {/* Logo + Clinic Name */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: "#000",
          }}
        >
          <img
            src={Logo}
            alt="Clinic Logo"
            style={{
              width: "150px",
              height: "80px",
              borderRadius: "0%",
              paddingLeft: "10px",
            }}
          />

          <div>
            <h1
              style={{
                margin: "0",
                fontSize: "24px",
                color: "#0d6efd",
              }}
            >
              Dr. Thennarasu
            </h1>

            <p
              style={{
                margin: "0",
                fontSize: "14px",
                color: "#555",
              }}
            >
              Multispeciality Clinic
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav
          style={{
            display: open ? "flex" : "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color:
                location.pathname === "/" ? "#0d6efd" : "#333",
              fontWeight: "600",
            }}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/appointments"
            style={{
              textDecoration: "none",
              color:
                location.pathname === "/appointments"
                  ? "#0d6efd"
                  : "#333",
              fontWeight: "600",
            }}
            onClick={() => setOpen(false)}
          >
            Appointments
          </Link>

          <Link
            to="/book"
            onClick={() => setOpen(false)}
            style={{
              textDecoration: "none",
              backgroundColor: "#0d6efd",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "25px",
              fontWeight: "600",
            }}
          >
            Book Appointment
          </Link>
        </nav>

        {/* Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "none",
            fontSize: "24px",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>
    </header>
  );
}