import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ManageUsers() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [message, setMessage] = useState("");

    const [doctorForm, setDoctorForm] = useState({
        doctor_name: "",
        doctor_email: "",
        doctor_phone: "",
        doctor_specialization: ""
    });

    const [assignForm, setAssignForm] = useState({
        patientId: "",
        doctorId: ""
    });

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch users");
        }
    }, [token]);

    const fetchDoctors = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/doctors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to fetch doctors");
        }
    }, [token]);

    useEffect(() => {
        if (currentUser?.role === "admin") {
            fetchUsers();
            fetchDoctors();
        }
    }, [fetchUsers, fetchDoctors, currentUser?.role]);

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
        setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
    };

    const handleAssignChange = (e) => {
        setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
    };

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5001/api/doctors",
                doctorForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setDoctorForm({ doctor_name: "", doctor_email: "", doctor_phone: "", doctor_specialization: "" });
            fetchDoctors();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to create doctor");
        }
    };

    const handleAssignDoctor = async (e) => {
        e.preventDefault();
        if (!assignForm.patientId) {
            setMessage("Please select a patient.");
            return;
        }
        try {
            const res = await axios.put(
                "http://localhost:5001/api/users/assign-doctor",
                {
                    patientId: parseInt(assignForm.patientId),
                    doctorId: assignForm.doctorId ? parseInt(assignForm.doctorId) : null
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setAssignForm({ patientId: "", doctorId: "" });
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to assign doctor");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await axios.delete(`http://localhost:5001/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to delete user");
        }
    };

    const handleDeleteDoctor = async (doctorId) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        try {
            const res = await axios.delete(`http://localhost:5001/api/doctors/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchDoctors();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to delete doctor");
        }
    };

    const patients = users.filter((u) => u.user_role === "patient");

    return (
        <div className="page-container">
            <Navbar />
            <h1>Manage Users</h1>
            {message && <p className="message">{message}</p>}

            {/* ── Add Doctor ── */}
            <div className="dashboard-card">
                <h2>Add New Doctor</h2>
                <form onSubmit={handleCreateDoctor} className="admin-form">
                    <input
                        type="text"
                        name="doctor_name"
                        placeholder="Doctor name"
                        value={doctorForm.doctor_name}
                        onChange={handleDoctorChange}
                    />
                    <input
                        type="email"
                        name="doctor_email"
                        placeholder="Doctor email"
                        value={doctorForm.doctor_email}
                        onChange={handleDoctorChange}
                    />
                    <input
                        type="text"
                        name="doctor_phone"
                        placeholder="Doctor phone"
                        value={doctorForm.doctor_phone}
                        onChange={handleDoctorChange}
                    />
                    <input
                        type="text"
                        name="doctor_specialization"
                        placeholder="Specialization"
                        value={doctorForm.doctor_specialization}
                        onChange={handleDoctorChange}
                    />
                    <button className="btn btn-primary" type="submit">Add Doctor</button>
                </form>
            </div>

            {/* ── Assign Doctor to Patient ── */}
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
                            <option key={patient.user_id} value={patient.user_id}>
                                {patient.user_name} — {patient.user_email}
                                {patient.assigned_doctor_name
                                    ? ` (currently: Dr. ${patient.assigned_doctor_name})`
                                    : " (unassigned)"}
                            </option>
                        ))}
                    </select>
                    <select
                        name="doctorId"
                        value={assignForm.doctorId}
                        onChange={handleAssignChange}
                    >
                        <option value="">Unassign / No doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                Dr. {doctor.doctor_name} — {doctor.doctor_specialization}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary" type="submit">Save Assignment</button>
                </form>
            </div>

            {/* ── Doctors List ── */}
            <h2>Doctors ({doctors.length})</h2>
            <div className="card-grid">
                {doctors.map((doctor) => (
                    <div className="dashboard-card" key={doctor.doctor_id}>
                        <h3>{doctor.doctor_name}</h3>
                        <p>Specialization: {doctor.doctor_specialization}</p>
                        <p>Email: {doctor.doctor_email}</p>
                        <p>Phone: {doctor.doctor_phone}</p>
                        <button className="btn btn-danger" onClick={() => handleDeleteDoctor(doctor.doctor_id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Patients List ── */}
            <h2>Patients ({patients.length})</h2>
            <div className="card-grid">
                {patients.map((user) => (
                    <div className="dashboard-card" key={user.user_id}>
                        <h3>{user.user_name}</h3>
                        <p>Email: {user.user_email}</p>
                        <p>Phone: {user.user_phone}</p>
                        <p>
                            Assigned Doctor:{" "}
                            {user.assigned_doctor_name
                                ? `Dr. ${user.assigned_doctor_name} (${user.assigned_doctor_specialization})`
                                : "Not assigned yet"}
                        </p>
                        <button className="btn btn-danger" onClick={() => handleDeleteUser(user.user_id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}

export default ManageUsers;
