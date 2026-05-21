import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className = "page-container">
            <Navbar />
            <h1>My Profile</h1>

            <div className="dashboard-card">
                <h3>User Information</h3>
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
            </div>
            <div className="dashboard-card">
                <h3>Account Security</h3>
                <p>Password protected using JWT authentication</p>
                <p>Authenticated session required to access profile</p>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;