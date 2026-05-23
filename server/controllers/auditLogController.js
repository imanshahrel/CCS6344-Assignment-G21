const db = require("../config/db");

// ── GET ALL AUDIT LOGS (admin only) ───────────────────────────────────────────
// GET /api/audit-logs
exports.getAllAuditLogs = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                al.*,
                u.user_name,
                u.user_email,
                u.user_role
            FROM audit_logs al
            JOIN users u ON al.user_id = u.user_id
            ORDER BY al.auditlogs_logtime DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── GET AUDIT LOGS BY USER ID (admin only) ────────────────────────────────────
// GET /api/audit-logs/user/:userId
exports.getAuditLogsByUser = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT al.*, u.user_name, u.user_email
             FROM audit_logs al
             JOIN users u ON al.user_id = u.user_id
             WHERE al.user_id = ?
             ORDER BY al.auditlogs_logtime DESC`,
            [req.params.userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
