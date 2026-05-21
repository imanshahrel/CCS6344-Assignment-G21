function PatientDashboard() {
    return (
        <div className = "card-grid">
            <h1>Patient Dashboard</h1>
            
            <div className="dashboard-card">
                <h3>Total Appointments</h3>
                <p>Upcoming Appointments</p>
            </div>

            <div className="dashboard-card">
                <h3>Medical Records</h3>
                <p>View your consultation history</p>
            </div>
           

            <div className="dashboard-card">
                <h3>Profile Information</h3>
                <p>Manage your profile details</p>
            </div>
        </div>
    );
}

export default PatientDashboard;