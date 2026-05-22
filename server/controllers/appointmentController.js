const db = require("../config/db");

exports.getDoctorUpcomingAppointments = (req, res) => {
    const doctorId = req.user.id;

    const sql = `
        SELECT 
            a.id,
            p.name AS patientName,
            p.email AS patientEmail,
            a.appointment_date AS date,
            a.appointment_time AS time,
            a.reason,
            a.status
        FROM appointments a
        JOIN users p ON a.patient_id = p.id
        WHERE a.doctor_id = ?
        AND a.appointment_date >= CURDATE()
        ORDER BY a.appointment_date, a.appointment_time
    `;

    db.query(sql, [doctorId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch doctor appointments",
                error: err
            });
        }

        res.status(200).json(result);
    });
};