import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f8ff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#0d6efd" }}>Choose Login</h1>
        <p>Select your login type</p>

        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop: "30px",
          }}
        >
          <Link
            to="/patient-login"
            style={{
              width: "280px",
              padding: "30px",
              textDecoration: "none",
              background: "white",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
              color: "black",
            }}
          >
            <h1>👤</h1>
            <h2>Patient Login</h2>
            <p>Book appointments and view reports.</p>
          </Link>

          <Link
            to="/hospital-login"
            style={{
              width: "280px",
              padding: "30px",
              textDecoration: "none",
              background: "white",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
              color: "black",
            }}
          >
            <h1>🏥</h1>
            <h2>Hospital Login</h2>
            <p>Manage appointments and patients.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}