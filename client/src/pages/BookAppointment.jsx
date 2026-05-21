import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios"; 

function BookAppointment() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !time || !reason) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (reason.length < 5) {
            setMessage("Please elaborate.");
            return;
        }
        
        try {
            const token = localStorage.getItem("token");

            // execution pauses here until the request finishes
            const res = await axios.post(
                "http://localhost:5000/api/appointments",
                {
                    date, time, reason
                },
                {
                    header: {
                        // sends appointment data to the backend API with the JWT token
                        // this proves: frontend form -> backend API -> protected request
                        Authorization: 'Bearer ${token}',
                    },
                }
            ); // !!! Iman must create backend route for this

            setMessage(res.data.message || "Appointment booked successfully.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to book appoitnment");
        }
    };
    return (
        <div>
            <Navbar />
            <h1>Book Appointment</h1>
            {message && <p>{message}</p>}
            <div className="dashboard-card">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Appointment Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Appointment Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Reason for Visit</label>
                        <textarea
                            placeholder="Enter reason for appointment"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit">Book Appointment</button>
                </form>
            </div>
            
        </div>
    );
}

export default BookAppointment;