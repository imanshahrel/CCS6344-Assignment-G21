import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

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
            <button onClick={handleLogout}>Logout</button>

            {role === "admin" && <AdminDashboard />}
            {role === "doctor" && <DoctorDashboard />}
            {role === "patient" && <PatientDashboard />}

            {!role && (
                <div>
                    <h1>No role found</h1>
                    <p>Please login again.</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;