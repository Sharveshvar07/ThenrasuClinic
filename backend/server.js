import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongo } from "./mongodb.js";
import specialitiesRouter from "./routes/specialities.js";
import appointmentsRouter from "./routes/appointments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const demoUsers = {
  patient: {
    id: 1,
    role: "patient",
    name: "Demo Patient",
    email: "patient@gmail.com",
    password: "123456",
  },
  hospital: {
    id: 2,
    role: "hospital",
    name: "Demo Hospital",
    staffId: "ADMIN001",
    password: "admin123",
  },
};

const PATIENT_TOKEN_PREFIX = "demo-patient-token:";

// Health check
app.get("/api/healthz", (req, res) => res.json({ status: "ok" }));

app.post("/api/auth/login", (req, res) => {
  const { role, email, password, staffId } = req.body;

  if (role === "patient") {
    const normalizedEmail = email?.trim().toLowerCase();
    if (password !== demoUsers.patient.password || !normalizedEmail) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = normalizedEmail === demoUsers.patient.email
      ? demoUsers.patient
      : {
          id: demoUsers.patient.id,
          role: demoUsers.patient.role,
          name: demoUsers.patient.name,
          email: normalizedEmail,
          password: undefined,
        };

    return res.json({
      token: `${PATIENT_TOKEN_PREFIX}${encodeURIComponent(normalizedEmail)}`,
      user: { ...user, password: undefined },
    });
  }

  if (role === "hospital") {
    const user = demoUsers.hospital;
    if (staffId === user.staffId && password === user.password) {
      return res.json({
        token: `demo-${role}-token`,
        user: { ...user, password: undefined },
      });
    }
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (token.startsWith(PATIENT_TOKEN_PREFIX)) {
    const email = decodeURIComponent(token.slice(PATIENT_TOKEN_PREFIX.length));
    return res.json({ user: { id: demoUsers.patient.id, role: demoUsers.patient.role, name: demoUsers.patient.name, email, password: undefined } });
  }

  if (token === "demo-hospital-token") {
    return res.json({ user: { ...demoUsers.hospital, password: undefined } });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

// API routes
app.use("/api/specialities",  specialitiesRouter);
app.use("/api/appointments", appointmentsRouter);

connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });