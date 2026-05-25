import { useState } from "react";
import axios from "axios"; // make HTTP requests to external servers or APIs (allow fetch, send, and manage data)
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
        
        // validation
        // to stop users from submitting empty or invalid login data before sending it to the backend
        if (!formData.email || !formData.password) {
            setMessage("Please enter both email and password.");
            return;
        }

        if (!formData.email.includes("@")) {
            setMessage("Please enter a valid email address.");
            return;
        }

        // calling API/login request (only after validation passes)
        try {
            const res = await axios.post("http://localhost:5001/api/users/login", formData);

            // save both the token and user role correctly
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setMessage("Login successful");
            navigate("/dashboard");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login Page</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    // type="text" enable us to use custom React message.
                    // type="email" if want to use HTML validation, both is fine.
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                />


                
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                />



                <button className="btn btn-primary" type="submit">Login</button>
            </form>

            {message && <p className="message">{message}</p>}
            <p>
                Don&apos;t have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;
