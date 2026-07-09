import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPatient } from "../api";
import Toast from "../components/Toast";
import "./../css/login.css";

const GENDERS = ["Male", "Female", "Other"];

export default function PatientRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number.";
    if (!form.age) e.age = "Age is required.";
    else if (Number(form.age) < 1 || Number(form.age) > 120) e.age = "Enter a valid age.";
    if (!form.gender) e.gender = "Gender is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "phone"
      ? value.replace(/\D/g, "").slice(0, 10)
      : value;

    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await registerPatient({
        name: form.name.trim(),
        phone: form.phone.trim(),
        age: Number(form.age),
        gender: form.gender,
        email: form.email.trim().toLowerCase(),
        address: form.address.trim(),
        password: form.password,
      });
      localStorage.setItem("clinicAuth", JSON.stringify({ token: data.token, user: data.user }));
      setToast({ message: "Registration successful", type: "success" });
      setTimeout(() => navigate("/appointments"), 700);
    } catch (err) {
      const message = err.response?.data?.error || "Registration failed. Please try again.";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-selection">
      <div className="login-container">
        <form className="login-form register-form" onSubmit={handleSubmit}>
          <h2>Patient Sign Up</h2>
          <p>Create your patient account to book appointments.</p>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          <div className="form-grid">
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label>
              Phone Number
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>

            <label>
              Age
              <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="30" min="1" max="120" />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </label>

            <label>
              Gender
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                {GENDERS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.gender && <span className="field-error">{errors.gender}</span>}
            </label>
          </div>

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@mail.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Address
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street, City, State" rows="4" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <label>
            Confirm Password
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </label>

          <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Sign Up"}</button>

          <p className="auth-switch">
            Already have an account? <Link to="/patient-login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
