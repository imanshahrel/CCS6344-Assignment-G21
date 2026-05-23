import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

function BookAppointment() {
    const token = localStorage.getItem("token");

    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        appointment_reason: ""
    });
    const [message, setMessage] = useState("");

    // Fetch doctors for the dropdown on page load
    const fetchDoctors = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/doctors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch (error) {
            setMessage("Failed to load doctors. Please try again.");
        }
    }, [token]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.doctor_id || !formData.appointment_date || !formData.appointment_time) {
            setMessage("Please fill in all required fields.");
            return;
        }

        if (formData.appointment_reason.length > 0 && formData.appointment_reason.length < 5) {
            setMessage("Please elaborate on your reason for visit.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5001/api/appointments",
                {
                    doctor_id: parseInt(formData.doctor_id),
                    appointment_date: formData.appointment_date,
                    appointment_time: formData.appointment_time,
                    appointment_reason: formData.appointment_reason || null
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage(res.data.message || "Appointment booked successfully.");
            // Reset form after successful booking
            setFormData({ doctor_id: "", appointment_date: "", appointment_time: "", appointment_reason: "" });
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to book appointment.");
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <h1>Book Appointment</h1>
            {message && <p className="message">{message}</p>}

            <div className="dashboard-card">
                <form onSubmit={handleSubmit}>

                    <div>
                        <label>Select Doctor</label>
                        <select
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                        >
                            <option value="">-- Choose a doctor --</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                    Dr. {doctor.doctor_name} — {doctor.doctor_specialization}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Appointment Date</label>
                        <input
                            type="date"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Appointment Time</label>
                        <input
                            type="time"
                            name="appointment_time"
                            value={formData.appointment_time}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Reason for Visit (optional)</label>
                        <textarea
                            name="appointment_reason"
                            placeholder="Enter reason for appointment"
                            value={formData.appointment_reason}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit">Book Appointment</button>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default BookAppointment;
