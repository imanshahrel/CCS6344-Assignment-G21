import { useState } from "react";
import Navbar from "../components/Navbar";

function BookAppointment() {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!date || !time || !reason) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (reason.length < 5) {
            setMessage("Please elaborate.");
            return;
        }
        setMessage("Appointment form sent!")
    };
    return (
        <div>
            <Navbar />
            <hi>Book Appointment</hi>
            {message && <p>{message}</p>}
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
                        onChange={(e)=>setReason(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
}

export default BookAppointment;