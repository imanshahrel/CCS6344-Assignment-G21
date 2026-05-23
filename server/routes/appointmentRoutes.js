const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// GET /api/appointments        — admin sees all; patient sees own
router.get("/", verifyToken, appointmentController.getAllAppointments);

// GET /api/appointments/:id    — admin or appointment owner
router.get("/:id", verifyToken, appointmentController.getAppointmentById);

// POST /api/appointments       — any logged-in user (patient books for themselves)
router.post("/", verifyToken, appointmentController.createAppointment);

// PUT /api/appointments/:id    — admin only (update status, reschedule)
router.put("/:id", verifyToken, verifyAdmin, appointmentController.updateAppointment);

// DELETE /api/appointments/:id — admin or patient cancels their own
router.delete("/:id", verifyToken, appointmentController.deleteAppointment);

module.exports = router;
