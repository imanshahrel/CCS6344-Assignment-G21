const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// GET /api/audit-logs               — all logs (admin only)
router.get("/", verifyToken, verifyAdmin, auditLogController.getAllAuditLogs);

// GET /api/audit-logs/user/:userId  — logs filtered by user (admin only)
router.get("/user/:userId", verifyToken, verifyAdmin, auditLogController.getAuditLogsByUser);

module.exports = router;
