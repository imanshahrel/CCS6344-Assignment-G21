import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MedicalRecords() {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [records, setRecords] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    const [recordForm, setRecordForm] = useState({
        appointment_id: "",
        mr_diagnosis: "",
        mr_treatment: "",
        mr_notes: ""
    });

    const fetchRecords = useCallback(async () => {
        try {
            const endpoint = currentUser?.role === "admin"
                ? "http://localhost:5001/api/medical-records"
                : "http://localhost:5001/api/medical-records/my";

            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecords(res.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch medical records");
        }
    }, [token, currentUser?.role]);

    // Admin only: fetch completed appointments to link records to
    const fetchCompletedAppointments = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/appointments", {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Only show completed appointments that don't already have a record
            const completed = res.data.filter(
                (a) => a.appointment_status === "completed"
            );
            setAppointments(completed);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchRecords();
        if (currentUser?.role === "admin") {
            fetchCompletedAppointments();
        }
    }, [fetchRecords, fetchCompletedAppointments, currentUser?.role]);

    const handleFormChange = (e) => {
        setRecordForm({ ...recordForm, [e.target.name]: e.target.value });
    };

    const handleCreateRecord = async (e) => {
        e.preventDefault();
        if (!recordForm.appointment_id || !recordForm.mr_diagnosis || !recordForm.mr_treatment) {
            setMessage("Appointment, diagnosis, and treatment are required.");
            return;
        }
        try {
            const res = await axios.post(
                "http://localhost:5001/api/medical-records",
                {
                    appointment_id: parseInt(recordForm.appointment_id),
                    mr_diagnosis: recordForm.mr_diagnosis,
                    mr_treatment: recordForm.mr_treatment,
                    mr_notes: recordForm.mr_notes || ""
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setRecordForm({ appointment_id: "", mr_diagnosis: "", mr_treatment: "", mr_notes: "" });
            fetchRecords();
            fetchCompletedAppointments();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to create medical record.");
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <h1>
                {currentUser?.role === "admin" ? "All Medical Records" : "My Medical Records"}
            </h1>
            {message && <p className="message">{message}</p>}

            {/* ── Admin: Create Medical Record form ── */}
            {currentUser?.role === "admin" && (
                <div className="dashboard-card">
                    <h2>Create Medical Record</h2>
                    {appointments.length === 0 ? (
                        <p>No completed appointments available to add records to.</p>
                    ) : (
                        <form onSubmit={handleCreateRecord} className="admin-form">
                            <select
                                name="appointment_id"
                                value={recordForm.appointment_id}
                                onChange={handleFormChange}
                            >
                                <option value="">-- Select completed appointment --</option>
                                {appointments.map((a) => (
                                    <option key={a.appointment_id} value={a.appointment_id}>
                                        {a.patient_name} — Dr. {a.doctor_name} — {a.appointment_date?.slice(0, 10)}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="mr_diagnosis"
                                placeholder="Diagnosis"
                                value={recordForm.mr_diagnosis}
                                onChange={handleFormChange}
                            />
                            <input
                                type="text"
                                name="mr_treatment"
                                placeholder="Treatment"
                                value={recordForm.mr_treatment}
                                onChange={handleFormChange}
                            />
                            <textarea
                                name="mr_notes"
                                placeholder="Additional notes (optional)"
                                value={recordForm.mr_notes}
                                onChange={handleFormChange}
                            />
                            <button type="submit">Create Record</button>
                        </form>
                    )}
                </div>
            )}

            {/* ── Records list ── */}
            <div className="card-grid">
                {records.length === 0 ? (
                    <p>No medical records found.</p>
                ) : (
                    records.map((record) => (
                        <div className="dashboard-card" key={record.mr_id}>
                            {currentUser?.role === "admin" && (
                                <h3>Patient: {record.patient_name}</h3>
                            )}
                            <p><strong>Doctor:</strong> Dr. {record.doctor_name}</p>
                            <p><strong>Specialization:</strong> {record.doctor_specialization}</p>
                            <p><strong>Date:</strong> {record.appointment_date?.slice(0, 10)}</p>
                            <p><strong>Diagnosis:</strong> {record.mr_diagnosis}</p>
                            <p><strong>Treatment:</strong> {record.mr_treatment}</p>
                            {record.mr_notes && (
                                <p><strong>Notes:</strong> {record.mr_notes}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MedicalRecords;
