import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MedicalRecords() {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const fetchRecords = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/medical-records/doctor?patientName=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRecords(res.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to fetch medical records"
            );
        }
    };

    useEffect(() => {
        if (currentUser?.role === "doctor") {
            fetchRecords();
        }
    }, []);

    if (currentUser?.role !== "doctor") {
        return (
            <div className="page-container">
                <Navbar />
                <p className="message">Access denied. Doctor only.</p>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Navbar />

            <h1>Medical Records</h1>

            {message && <p className="message">{message}</p>}

            <div className="dashboard-card">
                <h2>Search Patient</h2>

                <div className="admin-form">
                    <input
                        type="text"
                        placeholder="Search patient by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button type="button" onClick={fetchRecords}>
                        Search
                    </button>
                </div>
            </div>

            <div className="card-grid">
                {records.length === 0 ? (
                    <p>No medical records found.</p>
                ) : (
                    records.map((record) => (
                        <div className="dashboard-card" key={record.id}>
                            <h3>{record.patientName}</h3>
                            <p>Email: {record.patientEmail}</p>
                            <p>Doctor: {record.doctorName}</p>
                            <p>Diagnosis: {record.diagnosis}</p>
                            <p>Treatment: {record.treatment}</p>
                            <p>Notes: {record.notes}</p>
                            <p>Date: {record.date}</p>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MedicalRecords;