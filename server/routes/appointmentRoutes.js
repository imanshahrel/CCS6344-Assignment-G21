const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");
const { verifyToken, verifyDoctor } = require("../middleware/authMiddleware");

router.get(
    "/doctor/upcoming",
    verifyToken,
    verifyDoctor,
    appointmentController.getDoctorUpcomingAppointments
);

module.exports = router;