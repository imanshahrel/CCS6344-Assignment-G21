const express = require("express");
const router = express.Router();

const medicalRecordController = require("../controllers/medicalRecordController");
const { verifyToken, verifyDoctor } = require("../middleware/authMiddleware");

router.get(
    "/doctor",
    verifyToken,
    verifyDoctor,
    medicalRecordController.getDoctorMedicalRecords
);

module.exports = router;