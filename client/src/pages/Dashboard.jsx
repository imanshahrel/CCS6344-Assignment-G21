import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="page-container">
            <Navbar />
            <h2>Clinic Management System</h2>

            <p>Welcome, {user?.name}</p>
            <p>Role: {role}</p>

            <button onClick={handleLogout}>Logout</button>

            <hr />
            
            {role === "admin" && <AdminDashboard />}
            {role === "doctor" && <DoctorDashboard />}
            {role === "patient" && <PatientDashboard />}

            {!role && (
                <div>
                    <h1>No role found</h1>
                    <p>Please login again.</p>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Dashboard;