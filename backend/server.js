import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToMongo, getCollection } from "./mongodb.js";
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
    phone: "9876543210",
    age: 30,
    gender: "Male",
    address: "123 Demo St, Clinic City",
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

app.post("/api/auth/login", async (req, res) => {
  const { role, email, password, staffId } = req.body;

  if (role === "patient") {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const patientsCollection = getCollection("patients");
    const patient = await patientsCollection.findOne({ email: normalizedEmail });

    if (patient) {
      if (patient.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.json({
        token: `${PATIENT_TOKEN_PREFIX}${encodeURIComponent(normalizedEmail)}`,
        user: {
          id: patient._id.toString(),
          role: "patient",
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          age: patient.age,
          gender: patient.gender,
          address: patient.address,
        },
      });
    }

    if (password !== demoUsers.patient.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: `${PATIENT_TOKEN_PREFIX}${encodeURIComponent(normalizedEmail)}`,
      user: { ...demoUsers.patient, password: undefined },
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

app.get("/api/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (token.startsWith(PATIENT_TOKEN_PREFIX)) {
    const email = decodeURIComponent(token.slice(PATIENT_TOKEN_PREFIX.length));
    const patientsCollection = getCollection("patients");
    const patient = await patientsCollection.findOne({ email });

    if (patient) {
      return res.json({
        user: {
          id: patient._id.toString(),
          role: "patient",
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          age: patient.age,
          gender: patient.gender,
          address: patient.address,
        },
      });
    }

    return res.json({
      user: {
        ...demoUsers.patient,
        email,
        password: undefined,
      },
    });
  }

  if (token === "demo-hospital-token") {
    return res.json({ user: { ...demoUsers.hospital, password: undefined } });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, phone, age, gender, email, address, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !phone || !age || !gender || !normalizedEmail || !address || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const patientsCollection = getCollection("patients");
    const existing = await patientsCollection.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: "A patient with this email already exists." });
    }

    const insertResult = await patientsCollection.insertOne({
      name: name.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender: gender.trim(),
      email: normalizedEmail,
      address: address.trim(),
      password,
      createdAt: new Date(),
    });

    const user = {
      id: insertResult.insertedId.toString(),
      role: "patient",
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      age: Number(age),
      gender: gender.trim(),
      address: address.trim(),
    };

    return res.status(201).json({
      token: `${PATIENT_TOKEN_PREFIX}${encodeURIComponent(normalizedEmail)}`,
      user,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "A patient with this email already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
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