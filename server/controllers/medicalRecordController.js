const db = require("../config/db");
const { logAction } = require("../utils/auditLogger");

// ── GET ALL MEDICAL RECORDS (admin only) ──────────────────────────────────────
// GET /api/medical-records
exports.getAllMedicalRecords = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                mr.*,
                a.appointment_date,
                a.appointment_time,
                a.appointment_status,
                a.appointment_reason,
                u.user_name  AS patient_name,
                d.doctor_name
            FROM medical_records mr
            JOIN appointments a ON mr.appointment_id = a.appointment_id
            JOIN users        u ON a.patient_id       = u.user_id
            JOIN doctors      d ON a.doctor_id        = d.doctor_id
            ORDER BY mr.mr_id DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET MY MEDICAL RECORDS (patient) ─────────────────────────────────────────
// GET /api/medical-records/my
// Returns all records belonging to the currently logged-in patient
exports.getMyMedicalRecords = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                mr.*,
                a.appointment_date,
                a.appointment_time,
                d.doctor_name,
                d.doctor_specialization
            FROM medical_records mr
            JOIN appointments a ON mr.appointment_id = a.appointment_id
            JOIN doctors      d ON a.doctor_id        = d.doctor_id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC
        `, [req.user.id]);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET MEDICAL RECORDS BY APPOINTMENT ───────────────────────────────────────
// GET /api/medical-records/appointment/:appointmentId
exports.getMedicalRecordsByAppointment = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM medical_records WHERE appointment_id = ?",
            [req.params.appointmentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET MEDICAL RECORD BY ID ──────────────────────────────────────────────────
// GET /api/medical-records/:id
exports.getMedicalRecordById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                mr.*,
                a.appointment_date,
                a.appointment_time,
                a.patient_id,
                u.user_name  AS patient_name,
                d.doctor_name
            FROM medical_records mr
            JOIN appointments a ON mr.appointment_id = a.appointment_id
            JOIN users        u ON a.patient_id       = u.user_id
            JOIN doctors      d ON a.doctor_id        = d.doctor_id
            WHERE mr.mr_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Medical record not found." });
        }

        const record = rows[0];

        // Patient can only view their own records
        if (req.user.role !== "admin" && record.patient_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied." });
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── CREATE MEDICAL RECORD (admin only) ───────────────────────────────────────
// POST /api/medical-records
exports.createMedicalRecord = async (req, res) => {
    const { appointment_id, mr_diagnosis, mr_treatment, mr_notes } = req.body;

    if (!appointment_id || !mr_diagnosis || !mr_treatment) {
        return res.status(400).json({
            message: "appointment_id, mr_diagnosis, and mr_treatment are required."
        });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO medical_records (appointment_id, mr_diagnosis, mr_treatment, mr_notes) VALUES (?, ?, ?, ?)",
            [appointment_id, mr_diagnosis, mr_treatment, mr_notes || ""]
        );

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `CREATE_MEDICAL_RECORD_${result.insertId}`, ip);

        res.status(201).json({
            message: "Medical record created successfully.",
            mr_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── UPDATE MEDICAL RECORD (admin only) ───────────────────────────────────────
// PUT /api/medical-records/:id
exports.updateMedicalRecord = async (req, res) => {
    const { mr_diagnosis, mr_treatment, mr_notes } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE medical_records SET mr_diagnosis = ?, mr_treatment = ?, mr_notes = ? WHERE mr_id = ?",
            [mr_diagnosis, mr_treatment, mr_notes, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Medical record not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `UPDATE_MEDICAL_RECORD_${req.params.id}`, ip);

        res.status(200).json({ message: "Medical record updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── DELETE MEDICAL RECORD (admin only) ───────────────────────────────────────
// DELETE /api/medical-records/:id
exports.deleteMedicalRecord = async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM medical_records WHERE mr_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Medical record not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `DELETE_MEDICAL_RECORD_${req.params.id}`, ip);

        res.status(200).json({ message: "Medical record deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
