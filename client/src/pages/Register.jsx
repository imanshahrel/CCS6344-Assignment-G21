import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            setMessage("Please fill in all fields.");
        }

        if (!formData.password.length < 6) {
            setMessage("Password must be at least 6 characters.")
        }

        try {
            await axios.post("http://localhost:5000/api/users/register", {
                ...formData,
                role: "patient" // role is set to patient only upon registration
                                // doctor role is to be assign by assigned by the admin
            });

            setMessage("Registration successful");
            navigate("/");
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Patient Registration</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <br />

                <button type="submit">Register</button>
            </form>

            <p>{message}</p>

            <p>
                Already have an account? <Link to="/">Login here</Link>
            </p>
        </div>
    );
}

export default Register;