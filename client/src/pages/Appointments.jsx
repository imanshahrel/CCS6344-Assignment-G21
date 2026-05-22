import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// BE later: enforce appointment access properly using SQL query + JWT user ID.

function Appointments() {
    const user = JSON.parse(localStorage.getItem("user"));

    // Temporary sample data.
    // FE later: replace this with real API data from backend.
    const allAppointments = [
        {
            id: 1,
            patientName: "Nelly",
            patientEmail: "nelly@gmail.com",
            date: "2026-05-23",
            time: "10:00 AM",
            reason: "General check-up",
            status: "Pending",
        },
        {
            id: 2,
            patientName: "Iman",
            patientEmail: "iman@gmail.com",
            date: "2026-05-25",
            time: "2:30 PM",
            reason: "Follow-up consultation",
            status: "Approved",
        },
    ];

    const appointments =
        user?.role === "patient"
            ? allAppointments.filter(
                (appointment) => appointment.patientEmail === user.email
            )
            : allAppointments;

    return (
        <div className="page-container">
            <Navbar />

            <h1>Appointments</h1>

            <div className="card-grid">
                {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                        <div className="dashboard-card" key={appointment.id}>
                            <h3>{appointment.reason}</h3>
                            <p>Patient: {appointment.patientName}</p>
                            <p>Date: {appointment.date}</p>
                            <p>Time: {appointment.time}</p>
                            <p>Status: {appointment.status}</p>
                        </div>
                    ))
                ) : (
                    <p className="message">
                        No appointments found for this account.
                    </p>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Appointments;

