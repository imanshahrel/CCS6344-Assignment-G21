const db = require("../config/db");
const { logAction } = require("../utils/auditLogger");

// ── GET ALL APPOINTMENTS ──────────────────────────────────────────────────────
exports.getAllAppointments = async (req, res) => {
    try {
        let rows;

        if (req.user.role === "admin") {
            [rows] = await db.query(`
                SELECT 
                    a.*,
                    u.user_name   AS patient_name,
                    d.doctor_name,
                    d.doctor_specialization
                FROM appointments a
                JOIN users   u ON a.patient_id = u.user_id
                JOIN doctors d ON a.doctor_id  = d.doctor_id
                ORDER BY a.appointment_date DESC, a.appointment_time DESC
            `);
        } else {
            [rows] = await db.query(`
                SELECT 
                    a.*,
                    u.user_name   AS patient_name,
                    d.doctor_name,
                    d.doctor_specialization
                FROM appointments a
                JOIN users   u ON a.patient_id = u.user_id
                JOIN doctors d ON a.doctor_id  = d.doctor_id
                WHERE a.patient_id = ?
                ORDER BY a.appointment_date DESC, a.appointment_time DESC
            `, [req.user.id]);
        }

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET APPOINTMENT BY ID ─────────────────────────────────────────────────────
exports.getAppointmentById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                a.*,
                u.user_name   AS patient_name,
                d.doctor_name,
                d.doctor_specialization
            FROM appointments a
            JOIN users   u ON a.patient_id = u.user_id
            JOIN doctors d ON a.doctor_id  = d.doctor_id
            WHERE a.appointment_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const appt = rows[0];
        if (req.user.role !== "admin" && appt.patient_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied." });
        }

        res.status(200).json(appt);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── CREATE APPOINTMENT ────────────────────────────────────────────────────────
// Accepts: doctor_id, appointment_date, appointment_time, appointment_reason
// Patient books for themselves; admin can specify a patient_id
exports.createAppointment = async (req, res) => {
    const {
        doctor_id,
        appointment_date,
        appointment_time,
        appointment_reason,
        patient_id
    } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
            message: "doctor_id, appointment_date, and appointment_time are required."
        });
    }

    const resolvedPatientId = req.user.role === "admin" && patient_id
        ? patient_id
        : req.user.id;

    try {
        const [result] = await db.query(
            `INSERT INTO appointments 
             (patient_id, doctor_id, appointment_date, appointment_time, appointment_status, appointment_reason) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [resolvedPatientId, doctor_id, appointment_date, appointment_time, "pending", appointment_reason || null]
        );

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `CREATE_APPOINTMENT_${result.insertId}`, ip);

        res.status(201).json({
            message: "Appointment booked successfully.",
            appointment_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── UPDATE APPOINTMENT (Admin only) ───────────────────────────────────────────────────────
// PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
    const {
        appointment_status,
        appointment_date,
        appointment_time,
        doctor_id,
        appointment_reason
    } = req.body;

    try {
        const [existingRows] = await db.query(
            "SELECT * FROM appointments WHERE appointment_id = ?",
            [req.params.id]
        );

        if (existingRows.length === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const existingAppointment = existingRows[0];

        const updatedStatus = appointment_status ?? existingAppointment.appointment_status;
        const updatedDate = appointment_date ?? existingAppointment.appointment_date;
        const updatedTime = appointment_time ?? existingAppointment.appointment_time;
        const updatedDoctorId = doctor_id ?? existingAppointment.doctor_id;
        const updatedReason = appointment_reason ?? existingAppointment.appointment_reason;

        await db.query(
            `UPDATE appointments
             SET appointment_status = ?,
                 appointment_date = ?,
                 appointment_time = ?,
                 doctor_id = ?,
                 appointment_reason = ?
             WHERE appointment_id = ?`,
            [
                updatedStatus,
                updatedDate,
                updatedTime,
                updatedDoctorId,
                updatedReason,
                req.params.id
            ]
        );

        // If appointment is completed, create ONE medical record only if it does not exist yet
        if (updatedStatus === "completed") {
            const [existingRecordRows] = await db.query(
                "SELECT * FROM medical_records WHERE appointment_id = ?",
                [req.params.id]
            );

            if (existingRecordRows.length === 0) {
                await db.query(
                    `INSERT INTO medical_records
                     (appointment_id, mr_diagnosis, mr_treatment, mr_notes)
                     VALUES (?, ?, ?, ?)`,
                    [
                        req.params.id,
                        "Pending diagnosis",
                        "Pending treatment",
                        "Appointment marked as completed. Admin should update this medical record."
                    ]
                );
            }
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `UPDATE_APPOINTMENT_${req.params.id}`, ip);

        res.status(200).json({
            message:
                updatedStatus === "completed"
                    ? "Appointment completed. Medical record is ready for update."
                    : "Appointment updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error.message
        });
    }
};

// ── DELETE APPOINTMENT ────────────────────────────────────────────────────────
exports.deleteAppointment = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            const [rows] = await db.query(
                "SELECT patient_id FROM appointments WHERE appointment_id = ?",
                [req.params.id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            if (rows[0].patient_id !== req.user.id) {
                return res.status(403).json({ message: "Access denied." });
            }
        }

        const [result] = await db.query(
            "DELETE FROM appointments WHERE appointment_id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `DELETE_APPOINTMENT_${req.params.id}`, ip);

        res.status(200).json({ message: "Appointment deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
