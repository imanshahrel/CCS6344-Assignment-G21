import Navbar from "../components/Navbar";

function Profile() {
    return (
        <div>
            <h1>My Profile</h1>

            <div classname="dashboard-card">
                <h3>User Information</h3>
                <p>Name: {user?.name}</p>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
            </div>
        </div>
    );
}

export default Profile;