import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// phase 1: FE mock data (current)
// phase 2: backend API ready (by iman)
// phase 3: replace mock data with Axios + real db

function ManageUsers() {
    const users = [
        { id: 1, name: "Nelly", email: "nelly@email.com", role: "patient" },
        { id: 2, name: "Dr. Ahmad", email: "doctor@email.com", role: "doctor" },
        { id: 3, name: "Admin", email: "admin@email.com", role: "admin" },
    ];

    return (
        <div className="page-container">
            <Navbar />

            <h1>Manage Users</h1>

            <div className="card-grid">
                {users.map((user) => (
                    <div className="dashboard-card" key={user.id}>
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                        <button>Deactivate User</button>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}

export default ManageUsers;