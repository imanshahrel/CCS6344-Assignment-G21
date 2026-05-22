import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// phase 1: FE mock data (current)
// phase 2: backend API ready (by iman)
// phase 3: replace mock data with Axios + real db

function AssignDoctor() {
    return (
        <div className="page-container">
            <Navbar />

            <h1>Assign Doctor</h1>

            <div className="dashboard-card">
                <form>
                    <label>Select Patient</label>
                    <select>
                        <option>Nelly</option>
                        <option>Ain</option>
                    </select>

                    <label>Select Doctor</label>
                    <select>
                        <option>Dr. Faiz</option>
                        <option>Dr. Yan</option>
                    </select>

                    <button type="submit">Assign Doctor</button>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default AssignDoctor;