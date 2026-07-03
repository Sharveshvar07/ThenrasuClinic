import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import HospitalLogin from "./pages/HospitalLogin";
import "./index.css";
import "./clinic.css";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/book"
              element={
                <ProtectedRoute allowedRole={["patient"]}>
                  <Book />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRole={["hospital", "patient"]}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/hospital-login" element={<HospitalLogin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;