import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Appointments from "./pages/Appointments";
import AdminPortal from "./pages/AdminPortal";
import "./index.css";
import "./clinic.css";
import Pricing from "./pages/Pricing";
import OurService from "./pages/OurService";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Public booking — no login required */}
            <Route path="/book" element={<Book />} />
            {/* Admin-only appointments dashboard */}
            <Route
              path="/appointments"
              element={
                <AdminRoute>
                  <Appointments />
                </AdminRoute>
              }
            />
            <Route path="/services" element={<OurService />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* ── Hidden admin portal — not linked anywhere publicly ── */}
            <Route path="/portal/tc-admin-access" element={<AdminPortal />} />

            {/* Redirect old public login routes to home */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/patient-login" element={<Navigate to="/" replace />} />
            <Route path="/patient-register" element={<Navigate to="/" replace />} />
            <Route path="/hospital-login" element={<Navigate to="/" replace />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;