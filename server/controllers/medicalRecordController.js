const db = require("../config/db");

exports.getDoctorMedicalRecords = (req, res) => {
    const doctorId = req.user.id;
    const patientName = req.query.patientName || "";

    const sql = `
        SELECT 
            mr.mr_id AS id,
            p.name AS patientName,
            p.email AS patientEmail,
            d.name AS doctorName,
            mr.diagnosis,
            mr.treatment,
            mr.notes,
            mr.created_at AS date
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN users p ON a.patient_id = p.id
        JOIN users d ON a.doctor_id = d.id
        WHERE a.doctor_id = ?
        AND p.name LIKE ?
        ORDER BY mr.created_at DESC
    `;

    db.query(sql, [doctorId, `%${patientName}%`], (err, result) => {
        if (err) {
            console.log("Medical records SQL error:", err);
            return res.status(500).json({
                message: "Failed to fetch medical records",
                error: err
            });
        }

        res.status(200).json(result);
    });
};