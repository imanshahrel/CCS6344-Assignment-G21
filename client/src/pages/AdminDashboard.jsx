function AdminDashboard() {
    return (
        <div className="card-grid">
            <h1>Admin Dashboard</h1>

            <div className="dashboard-card">
                <h3>Appointments</h3>
                <p>View or update the status of appointments</p>
            </div>

            <div className="dashboard-card">
                <h3>Medical Records</h3>
                <p>Edit or delete completed medical records</p>
            </div>

            <div className="dashboard-card">
                <h3>Manage Users</h3>
                <p>Add or delete doctor accounts, and assign doctor to patient</p>
            </div>

            <div className="dashboard-card">
                <h3>Profile</h3>
                <p>View profile details</p>
            </div>
        </div>
    );
}

export default AdminDashboard;