import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Book from "./pages/Book";
import Appointments from "./pages/Appointments";

import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import HospitalLogin from "./pages/HospitalLogin";

import "./index.css";
import "./clinic.css";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Existing Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} />
            <Route path="/appointments" element={<Appointments />} />

            {/* Login Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/hospital-login" element={<HospitalLogin />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;