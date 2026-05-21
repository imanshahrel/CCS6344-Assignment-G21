function AdminDashboard() {
    return (
        <div className="card-grid">
            <h1>Admin Dashboard</h1>

            <div className="dashboard-card">
                <h3>Manage Users</h3>
                <p>Add, update, or remove patient and doctor accounts.</p>
            </div>

            <div className="dashboard-card">
                <h3>Assign Doctors</h3>
                <p>Assign doctors to patients or appointments</p>
            </div>

            <div className="dashboard-card">
                <h3>System Overview</h3>
                <p>Monitor clinic users, appointments, and system activity.</p>
            </div>
        </div>
    );
}

export default AdminDashboard;