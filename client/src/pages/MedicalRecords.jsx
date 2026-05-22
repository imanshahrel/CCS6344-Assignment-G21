import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// BE later: enforce medical record access properly using SQL query + JWT user ID.

function MedicalRecords() {
    const user = JSON.parse(localStorage.getItem("user"));

    // Temporary mock data.
    // FE later: replace this with real API data from backend.
    const allRecords = [
        {
            id: 1,
            patientName: "Nelly",
            patientEmail: "nelly@gmail.com",
            doctorName: "Dr. Faiz",
            diagnosis: "Fever",
            treatment: "Medication and rest",
            date: "2026-05-25",
        },
        {
            id: 2,
            patientName: "Iman",
            patientEmail: "iman@gmail.com",
            doctorName: "Dr. Hani",
            diagnosis: "Follow-up check",
            treatment: "Observation",
            date: "2026-05-28",
        },
    ];

    const records =
        user?.role === "patient"
            ? allRecords.filter((record) => record.patientEmail === user.email)
            : allRecords;

    return (
        <div className="page-container">
            <Navbar />

            <h1>Medical Records</h1>

            <div className="card-grid">
                {records.length > 0 ? (
                    records.map((record) => (
                        <div className="dashboard-card" key={record.id}>
                            <h3>{record.patientName}</h3>
                            <p>Doctor: {record.doctorName}</p>
                            <p>Diagnosis: {record.diagnosis}</p>
                            <p>Treatment: {record.treatment}</p>
                            <p>Date: {record.date}</p>
                        </div>
                    ))
                ) : (
                    <p className="message">No medical records found for this account.</p>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MedicalRecords;