import express from "express";
import cors from "cors";
import specialitiesRouter from "./routes/specialities.js";
import appointmentsRouter from "./routes/appointments.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/healthz", (req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/specialities",  specialitiesRouter);
app.use("/api/appointments", appointmentsRouter);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});