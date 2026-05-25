import AdminDashboard from "./AdminDashboard";
import PatientDashboard from "./PatientDashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    return (
        <div className="page-container">
            <Navbar />
            <p>Welcome, {user?.name}</p>
            <p>Role: {role}</p>


            <hr />
            
            {role === "admin" && <AdminDashboard />}
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