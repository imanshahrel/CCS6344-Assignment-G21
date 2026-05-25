require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: "Too many attempts from this IP, please try again after 15 minutes."
});

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
app.use("/api/auth", authLimiter); 
app.use("/api/users/login", authLimiter); 
app.use("/api/users/register", authLimiter); 
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
