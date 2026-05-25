const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecordController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// IMPORTANT: specific routes must be declared BEFORE /:id
// otherwise Express matches "my" and "appointment" as IDs

// GET /api/medical-records/my                       — logged-in patient's own records
router.get("/my", verifyToken, medicalRecordController.getMyMedicalRecords);

// GET /api/medical-records/appointment/:appointmentId
router.get("/appointment/:appointmentId", verifyToken, medicalRecordController.getMedicalRecordsByAppointment);

// GET /api/medical-records                          — admin only
router.get("/", verifyToken, verifyAdmin, medicalRecordController.getAllMedicalRecords);

// GET /api/medical-records/:id                      — admin or record's patient
router.get("/:id", verifyToken, medicalRecordController.getMedicalRecordById);

// POST /api/medical-records                         — admin only
router.post("/", verifyToken, verifyAdmin, medicalRecordController.createMedicalRecord);

// PUT /api/medical-records/:id                      — admin only
router.put("/:id", verifyToken, verifyAdmin, medicalRecordController.updateMedicalRecord);

// DELETE /api/medical-records/:id                   — admin only
router.delete("/:id", verifyToken, verifyAdmin, medicalRecordController.deleteMedicalRecord);

module.exports = router;
