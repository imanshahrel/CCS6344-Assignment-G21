import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MedicalRecords() {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [records, setRecords] = useState([]);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
        mr_diagnosis: "",
        mr_treatment: "",
        mr_notes: ""
    });

    const fetchRecords = useCallback(async () => {
        try {
            const endpoint =
                currentUser?.role === "admin"
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

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleEditClick = (record) => {
        setEditingId(record.mr_id);
        setEditForm({
            mr_diagnosis: record.mr_diagnosis || "",
            mr_treatment: record.mr_treatment || "",
            mr_notes: record.mr_notes || ""
        });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateRecord = async (e, mrId) => {
        e.preventDefault();

        if (!editForm.mr_diagnosis || !editForm.mr_treatment) {
            setMessage("Diagnosis and treatment are required.");
            return;
        }

        try {
            const res = await axios.put(
                `http://localhost:5001/api/medical-records/${mrId}`,
                {
                    mr_diagnosis: editForm.mr_diagnosis,
                    mr_treatment: editForm.mr_treatment,
                    mr_notes: editForm.mr_notes || ""
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage(res.data.message);
            setEditingId(null);
            fetchRecords();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to update medical record.");
        }
    };

    const handleDeleteRecord = async (mrId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this medical record?"
        );

        if (!confirmDelete) return;

        try {
            const res = await axios.delete(
                `http://localhost:5001/api/medical-records/${mrId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage(res.data.message);
            fetchRecords();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to delete medical record.");
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            <h1>
                {currentUser?.role === "admin"
                    ? "All Medical Records"
                    : "My Medical Records"}
            </h1>

            {message && <p className="message">{message}</p>}

            <div className="card-grid">
                {records.length === 0 ? (
                    <p className="message">No medical records found.</p>
                ) : (
                    records.map((record) => (
                        <div className="dashboard-card" key={record.mr_id}>
                            {currentUser?.role === "admin" && (
                                <h3>Patient: {record.patient_name}</h3>
                            )}

                            <p><strong>Doctor:</strong> {record.doctor_name}</p>
                            <p><strong>Specialization:</strong> {record.doctor_specialization}</p>
                            <p><strong>Date:</strong> {record.appointment_date?.slice(0, 10)}</p>
                            <p><strong>Reason:</strong> {record.appointment_reason || "No reason provided"}</p>

                            {editingId === record.mr_id ? (
                                <form
                                    className="admin-form"
                                    onSubmit={(e) => handleUpdateRecord(e, record.mr_id)}
                                >
                                    <input
                                        type="text"
                                        name="mr_diagnosis"
                                        placeholder="Diagnosis"
                                        value={editForm.mr_diagnosis}
                                        onChange={handleEditChange}
                                    />

                                    <input
                                        type="text"
                                        name="mr_treatment"
                                        placeholder="Treatment"
                                        value={editForm.mr_treatment}
                                        onChange={handleEditChange}
                                    />

                                    <textarea
                                        rows="4"
                                        name="mr_notes"
                                        placeholder="Additional notes"
                                        value={editForm.mr_notes}
                                        onChange={handleEditChange}
                                    />

                                    <div className="card-actions">
                                        <button className="btn btn-primary" type="submit">Save Update</button>
                                        <button className="card-actions btn btn-secondary" type="button" onClick={() => setEditingId(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p><strong>Diagnosis:</strong> {record.mr_diagnosis}</p>
                                    <p><strong>Treatment:</strong> {record.mr_treatment}</p>

                                    {record.mr_notes && (
                                        <p><strong>Notes:</strong> {record.mr_notes}</p>
                                    )}

                                        {currentUser?.role === "admin" && (
                                            <div className="card-actions">
                                                <button className="card-actions btn btn-primary" onClick={() => handleEditClick(record)}>
                                                    Edit Record
                                                </button>

                                                <button className="btn btn-danger" onClick={() => handleDeleteRecord(record.mr_id)}>
                                                    Delete Record
                                                </button>
                                            </div>
                                        )}
                                </>
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
