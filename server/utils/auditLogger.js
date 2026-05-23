const db = require("../config/db");

/**
 * Inserts a row into audit_logs.
 * Called automatically by controllers after every meaningful action.
 *
 * @param {number} userId     - The user performing the action
 * @param {string} action     - e.g. "USER_LOGIN", "CREATE_APPOINTMENT_5"
 * @param {string} ipAddress  - req.ip from the Express request
 */
const logAction = async (userId, action, ipAddress) => {
    try {
        await db.query(
            "INSERT INTO audit_logs (user_id, auditlogs_action, auditlogs_logtime, auditlogs_ipaddress) VALUES (?, ?, NOW(), ?)",
            [userId, action, ipAddress || "unknown"]
        );
    } catch (err) {
        // Never crash the main request if audit logging fails — just log to console
        console.error("Audit log failed:", err.message);
    }
};

module.exports = { logAction };
