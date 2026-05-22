import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ManageUsers() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    const [doctorForm, setDoctorForm] = useState({
        name: "",
        email: "",
        password: "",
        specialization: ""
    });

    const [assignForm, setAssignForm] = useState({
        patientId: "",
        doctorId: ""
    });

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(res.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch users");
        }
    };

    useEffect(() => {
        if (currentUser?.role === "admin") {
            fetchUsers();
        }
    }, []);

    if (currentUser?.role !== "admin") {
        return (
            <div className="page-container">
                <Navbar />
                <p className="message">Access denied. Admin only.</p>
                <Footer />
            </div>
        );
    }

    const handleDoctorChange = (e) => {
        setDoctorForm({
            ...doctorForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAssignChange = (e) => {
        setAssignForm({
            ...assignForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/users/doctor",
                doctorForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(res.data.message);

            setDoctorForm({
                name: "",
                email: "",
                password: "",
                specialization: ""
            });

            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to create doctor");
        }
    };

    const handleAssignDoctor = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                "http://localhost:5000/api/users/assign-doctor",
                assignForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(res.data.message);

            setAssignForm({
                patientId: "",
                doctorId: ""
            });

            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to assign doctor");
        }
    };

    const patients = users.filter((user) => user.role === "patient");
    const doctors = users.filter((user) => user.role === "doctor");

    return (
        <div className="page-container">
            <Navbar />

            <h1>Manage Users</h1>

            {message && <p className="message">{message}</p>}

            <div className="dashboard-card">
                <h2>Create Doctor Account</h2>

                <form onSubmit={handleCreateDoctor} className="admin-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Doctor name"
                        value={doctorForm.name}
                        onChange={handleDoctorChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Doctor email"
                        value={doctorForm.email}
                        onChange={handleDoctorChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={doctorForm.password}
                        onChange={handleDoctorChange}
                    />

                    <input
                        type="text"
                        name="specialization"
                        placeholder="Specialization"
                        value={doctorForm.specialization}
                        onChange={handleDoctorChange}
                    />

                    <button type="submit">Create Doctor</button>
                </form>
            </div>

            <div className="dashboard-card">
                <h2>Assign Doctor to Patient</h2>

                <form onSubmit={handleAssignDoctor} className="admin-form">
                    <select
                        name="patientId"
                        value={assignForm.patientId}
                        onChange={handleAssignChange}
                    >
                        <option value="">Select patient</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name} - {patient.email}
                            </option>
                        ))}
                    </select>

                    <select
                        name="doctorId"
                        value={assignForm.doctorId}
                        onChange={handleAssignChange}
                    >
                        <option value="">Select doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialization || "No specialization"}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Assign Doctor</button>
                </form>
            </div>

            <h2>All Users</h2>

            <div className="card-grid">
                {users.map((user) => (
                    <div className="dashboard-card" key={user.id}>
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>

                        {user.role === "doctor" && (
                            <p>Specialization: {user.specialization || "Not set"}</p>
                        )}

                        {user.role === "patient" && (
                            <p>
                                Assigned Doctor:{" "}
                                {user.assignedDoctorName || "Not assigned yet"}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}

export default ManageUsers;