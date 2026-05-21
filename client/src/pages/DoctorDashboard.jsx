function DoctorDashboard() {
    return (
        <div className="card-grid">
            <h1>Doctor Dashboard</h1>

            <div className="dashboard-card">
                <h3>Assigned Patients</h3>
                <p>View assigned patients.</p>
            </div>

            <div className="dashboard-card">
                <h3>Today&apos;s Appointments</h3>
                <p>Review scheduled consultations.</p>
            </div>

            <div className="dashboard-card">
                <h3>Consultation Notes</h3>
                <p>Update patient consultation records.</p>
            </div>
        </div>
    );
}

export default DoctorDashboard;