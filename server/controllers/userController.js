const db = require("../config/db");
const { logAction } = require("../utils/auditLogger");

// ── GET ALL USERS (admin only) ────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.user_id, u.user_name, u.user_email, u.user_role, 
                u.user_phone, u.user_create_at, u.doctor_id,
                d.doctor_name AS assigned_doctor_name,
                d.doctor_specialization AS assigned_doctor_specialization
            FROM users u
            LEFT JOIN doctors d ON u.doctor_id = d.doctor_id
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET USER BY ID ────────────────────────────────────────────────────────────
exports.getUserById = async (req, res) => {
    const targetId = parseInt(req.params.id);

    if (req.user.role !== "admin" && req.user.id !== targetId) {
        return res.status(403).json({ message: "Access denied." });
    }

    try {
        const [rows] = await db.query(`
            SELECT 
                u.user_id, u.user_name, u.user_email, u.user_role,
                u.user_phone, u.user_create_at, u.doctor_id,
                d.doctor_name AS assigned_doctor_name
            FROM users u
            LEFT JOIN doctors d ON u.doctor_id = d.doctor_id
            WHERE u.user_id = ?
        `, [targetId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── UPDATE USER ───────────────────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
    const targetId = parseInt(req.params.id);
    const { user_name, user_email, user_phone, user_role } = req.body;

    if (req.user.role !== "admin" && req.user.id !== targetId) {
        return res.status(403).json({ message: "Access denied." });
    }

    const roleToSet = req.user.role === "admin" ? user_role : undefined;

    try {
        const [result] = await db.query(
            `UPDATE users 
             SET user_name = ?, user_email = ?, user_phone = ?
             ${roleToSet !== undefined ? ", user_role = ?" : ""}
             WHERE user_id = ?`,
            roleToSet !== undefined
                ? [user_name, user_email, user_phone, roleToSet, targetId]
                : [user_name, user_email, user_phone, targetId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `UPDATE_USER_${targetId}`, ip);

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── ASSIGN DOCTOR TO PATIENT (admin only) ─────────────────────────────────────
exports.assignDoctor = async (req, res) => {
    const { patientId, doctorId } = req.body;

    if (!patientId) {
        return res.status(400).json({ message: "patientId is required." });
    }

    try {
        // Verify patient exists and is actually a patient
        const [patients] = await db.query(
            "SELECT user_id, user_role FROM users WHERE user_id = ?",
            [patientId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: "Patient not found." });
        }

        if (patients[0].user_role !== "patient") {
            return res.status(400).json({ message: "Target user is not a patient." });
        }

        // If doctorId is null/empty, unassign the doctor
        const resolvedDoctorId = doctorId || null;

        if (resolvedDoctorId) {
            // Verify doctor exists
            const [doctors] = await db.query(
                "SELECT doctor_id FROM doctors WHERE doctor_id = ?",
                [resolvedDoctorId]
            );
            if (doctors.length === 0) {
                return res.status(404).json({ message: "Doctor not found." });
            }
        }

        await db.query(
            "UPDATE users SET doctor_id = ? WHERE user_id = ?",
            [resolvedDoctorId, patientId]
        );

        const ip = req.ip || req.socket.remoteAddress;
        const action = resolvedDoctorId
            ? `ASSIGN_DOCTOR_${resolvedDoctorId}_TO_PATIENT_${patientId}`
            : `UNASSIGN_DOCTOR_FROM_PATIENT_${patientId}`;
        await logAction(req.user.id, action, ip);

        res.status(200).json({
            message: resolvedDoctorId
                ? "Doctor assigned successfully."
                : "Doctor unassigned successfully."
        });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── DELETE USER (admin only) ──────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
    const targetId = parseInt(req.params.id);

    try {
        const [result] = await db.query(
            "DELETE FROM users WHERE user_id = ?",
            [targetId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(req.user.id, `DELETE_USER_${targetId}`, ip);

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
