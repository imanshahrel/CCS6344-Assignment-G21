import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div>
            <h2>Dashboard</h2>

            {user ? (
                <>
                    <p>Welcome, {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>

                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                    <p>No user logged in</p>
            )}
        </div>
    );
}

export default Dashboard;