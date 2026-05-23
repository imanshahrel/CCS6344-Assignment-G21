require("dotenv").config();

const express = require("express");
const cors = require("cors");

// DB connection (imported here to trigger the startup connection test)
const db = require("./config/db");

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes         = require("./routes/authRoutes");
const userRoutes         = require("./routes/userRoutes");
const doctorRoutes       = require("./routes/doctorRoutes");
const appointmentRoutes  = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const auditLogRoutes     = require("./routes/auditLogRoutes");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Endpoints ─────────────────────────────────────────────────────────────
app.use("/api/auth",            authRoutes);
app.use("/api/users",           userRoutes);
app.use("/api/doctors",         doctorRoutes);
app.use("/api/appointments",    appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/audit-logs",      auditLogRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Clinic API running");
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
