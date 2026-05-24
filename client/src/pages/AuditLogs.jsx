import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get("http://localhost:5001/api/audit-logs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLogs(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to load audit logs.");
        }
    };

    return (
        <div className="page-container">
            <Navbar />

            <div className="page-header">
                <h1>Audit Logs</h1>
                <p>Monitor important user activities and security-related actions.</p>
            </div>

            {message && <p className="message">{message}</p>}

            <div className="audit-log-list">
                {logs.length === 0 ? (
                    <p className="message">No audit logs found.</p>
                ) : (
                    logs.map((log) => (
                        <div className="dashboard-card audit-log-card" key={log.auditlogs_id}>
                            <div className="audit-log-header">
                                <h3>{log.auditlogs_action}</h3>
                                <span className="role-badge">{log.user_role}</span>
                            </div>

                            <p>
                                <strong>User:</strong> {log.user_name}
                            </p>

                            <p>
                                <strong>Email:</strong> {log.user_email}
                            </p>

                            <p>
                                <strong>IP Address:</strong> {log.auditlogs_ipaddress || "Not recorded"}
                            </p>

                            <p>
                                <strong>Date & Time:</strong>{" "}
                                {new Date(log.auditlogs_logtime).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <Footer />
        </div>
    );
}

export default AuditLogs;