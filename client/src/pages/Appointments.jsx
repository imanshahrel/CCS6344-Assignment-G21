import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Appointments() {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/appointments/doctor/upcoming",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAppointments(res.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Failed to fetch appointments"
            );
        }
    };

    useEffect(() => {
        if (currentUser?.role === "doctor") {
            fetchAppointments();
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

            <h1>Upcoming Appointments</h1>

            {message && <p className="message">{message}</p>}

            <div className="card-grid">
                {appointments.length === 0 ? (
                    <p>No upcoming appointments found.</p>
                ) : (
                    appointments.map((appointment) => (
                        <div className="dashboard-card" key={appointment.id}>
                            <h3>{appointment.patientName}</h3>
                            <p>Email: {appointment.patientEmail}</p>
                            <p>Date: {appointment.date}</p>
                            <p>Time: {appointment.time}</p>
                            <p>Reason: {appointment.reason}</p>
                            <p>Status: {appointment.status}</p>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Appointments;

