import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Appointments() {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    const fetchAppointments = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/appointments", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch appointments");
        }
    }, [token]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return (
        <div className="page-container">
            <Navbar />
            <h1>
                {currentUser?.role === "admin" ? "All Appointments" : "My Appointments"}
            </h1>

            {message && <p className="message">{message}</p>}

            <div className="card-grid">
                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    appointments.map((appointment) => (
                        <div className="dashboard-card" key={appointment.appointment_id}>
                            {currentUser?.role === "admin" && (
                                <h3>Patient: {appointment.patient_name}</h3>
                            )}
                            <h3>{appointment.doctor_name}</h3>
                            <p>Specialization: {appointment.doctor_specialization}</p>
                            <p>Date: {appointment.appointment_date?.slice(0, 10)}</p>
                            <p>Time: {appointment.appointment_time}</p>
                            <p>Status: {appointment.appointment_status}</p>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Appointments;
