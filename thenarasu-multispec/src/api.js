import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const getCurrentUser = (token) => API.get("/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
});

// Specialties
export const getSpecialities = () => API.get("/specialities");

// Appointments
export const getAppointments     = ()         => API.get("/appointments");
export const getAppointmentStats = ()         => API.get("/appointments/stats");
export const getAppointment      = (id)       => API.get(`/appointments/${id}`);
export const createAppointment   = (data)     => API.post("/appointments", data);
export const updateAppointment   = (id, data) => API.patch(`/appointments/${id}`, data);