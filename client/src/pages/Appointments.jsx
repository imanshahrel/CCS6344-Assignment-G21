import Navbar from "../components/Navbar";

// Note to Iman (backend): this is just a sample appointment records before the backend integration
// replace const sampleAppointments = [...] with real API data from mysql (when backend appointment API exist later)

function Appointments() {
    // Temporary sample data.
    // This will be replaced with real appointment data from the backend later.
    const sampleAppointments = [
        {
            id: 1,
            date: "2026-05-23",
            time: "10:00 AM",
            reason: "General check-up",
            status: "Pending",
        },
        {
            id: 2,
            date: "2026-05-25",
            time: "2:30 PM",
            reason: "Follow-up consultation",
            status: "Approved",
        },
    ];
    return (
        <div>
            <Navbar />
            <h1>Appointments</h1>
            {sampleAppointments.map((appointment) => (
                <div className="dashboard-card" key={appointment.id}>
                    <h3>{appointment.reason}</h3>
                    <p>Date: {appointment.date}</p>
                    <p>Time: {appointment.time}</p>
                    <p>Status: {appointment.status}</p>
                </div>
            ))}
        </div>
    );
}

export default Appointments;