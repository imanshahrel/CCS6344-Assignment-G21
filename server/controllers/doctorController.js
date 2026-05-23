const db = require("../config/db");
const { logAction } = require("../utils/auditLogger");

// ── GET ALL DOCTORS ───────────────────────────────────────────────────────────
// GET /api/doctors
// Any logged-in user can view doctors (needed when booking an appointment)
exports.getAllDoctors = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM doctors ORDER BY doctor_name ASC");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET DOCTOR BY ID ──────────────────────────────────────────────────────────
// GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM doctors WHERE doctor_id = ?",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Doctor not found." });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── CREATE DOCTOR (admin only) ────────────────────────────────────────────────
// POST /api/doctors
exports.createDoctor = async (req, res) => {
    const { doctor_name, doctor_specialization, doctor_email, doctor_phone } = req.body;

    if (!doctor_name || !doctor_specialization || !doctor_email || !doctor_phone) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO doctors (doctor_name, doctor_specialization, doctor_email, doctor_phone) VALUES (?, ?, ?, ?)",
            [doctor_name, doctor_specialization, doctor_email, doctor_phone]
        );

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `CREATE_DOCTOR_${result.insertId}`, ip);

        res.status(201).json({
            message: "Doctor created successfully.",
            doctor_id: result.insertId
        });
    } catch (error) {
        // Catch duplicate email
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Doctor email already exists." });
        }
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── UPDATE DOCTOR (admin only) ────────────────────────────────────────────────
// PUT /api/doctors/:id
exports.updateDoctor = async (req, res) => {
    const { doctor_name, doctor_specialization, doctor_email, doctor_phone } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE doctors SET doctor_name = ?, doctor_specialization = ?, doctor_email = ?, doctor_phone = ? WHERE doctor_id = ?",
            [doctor_name, doctor_specialization, doctor_email, doctor_phone, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `UPDATE_DOCTOR_${req.params.id}`, ip);

        res.status(200).json({ message: "Doctor updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── DELETE DOCTOR (admin only) ────────────────────────────────────────────────
// DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM doctors WHERE doctor_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `DELETE_DOCTOR_${req.params.id}`, ip);

        res.status(200).json({ message: "Doctor deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
