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

                {/*RBAC: book appointment is set to only visible for patient*/} 
                {user?.role === "patient" && (
                    <li>
                        <Link to="/book-appointment">Book Appointment</Link>
                    </li>
                )}

                <li>
                    <Link to="/appointments">Appointments</Link>
                </li>
                
                {user?.role === "admin" && (
                    <li>
                        <Link to="/manage-users">Manage Users</Link>
                    </li>
                )}


                {(user?.role === "admin" || user?.role === "patient") && (
                    <li>
                        <Link to="/medical-records">Medical Records</Link>
                    </li>
                )}

                <li>
                    <Link to="/profile">Profile</Link>
                </li>

                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>

                

            </ul>
        </nav>
        
    );
}

export default Navbar;