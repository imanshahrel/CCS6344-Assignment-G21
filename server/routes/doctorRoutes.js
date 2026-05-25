const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// GET /api/doctors        — any logged-in user (needed for appointment booking dropdown)
router.get("/", verifyToken, doctorController.getAllDoctors);

// GET /api/doctors/:id    — any logged-in user
router.get("/:id", verifyToken, doctorController.getDoctorById);

// POST /api/doctors       — admin only
router.post("/", verifyToken, verifyAdmin, doctorController.createDoctor);

// PUT /api/doctors/:id    — admin only
router.put("/:id", verifyToken, verifyAdmin, doctorController.updateDoctor);

// DELETE /api/doctors/:id — admin only
router.delete("/:id", verifyToken, verifyAdmin, doctorController.deleteDoctor);

module.exports = router;
