function PatientDashboard() {
    return (
        <div className = "card-grid">
            <h1>Patient Dashboard</h1>
            
            <div className="dashboard-card">
                <h3>Book Appointments</h3>
                <p>Book new appointments</p>
            </div>

            <div className="dashboard-card">
                <h3>Appointments</h3>
                <p>View upcoming appointments</p>
            </div>

            <div className="dashboard-card">
                <h3>Medical Records</h3>
                <p>View consultation history</p>
            </div>
           

            <div className="dashboard-card">
                <h3>Profile Information</h3>
                <p>View profile details</p>
            </div>
        </div>
    );
}

export default PatientDashboard;