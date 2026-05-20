function BookAppointment() {
    return (
        <div>
            <hi>Book Appointment</hi>
            <form>
                <div>
                    <label>Appointment Date</label>
                    <input type="date" />
                </div>

                <div>
                    <label>Appointment Time</label>
                    <input type="time" />
                </div>

                <div>
                    <label>Reason for Visit</label>
                    <textarea placeholder="Enter reason for appointment"></textarea>
                </div>

                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
}

export default BookAppointment;