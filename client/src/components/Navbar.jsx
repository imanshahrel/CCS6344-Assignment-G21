import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    return (
        <nav>
            <h2>Clinic Management System</h2>
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/book-appointment">Book Appointment</Link>
                </li>
                <li>
                    <Link to="/appointments">Appointments</Link>
                </li>
                <li>
                    Logged in as: <strong>{user?.role}</strong>
                </li>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
        
    );
}

export default Navbar;