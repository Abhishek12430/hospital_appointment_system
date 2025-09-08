import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const fetchAppointments = async () => {
    const res = await axios.get(`http://localhost:5000/appointments/${user.id}`);
    setAppointments(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const cancelAppointment = async (id) => {
    await axios.delete(`http://localhost:5000/appointments/${id}`);
    setAppointments(appointments.filter((a) => a.id !== id)); // update UI
  };

  return (
    <div>
      <h2>My Appointments</h2>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            {a.patient_name} - {new Date(a.appointment_date).toLocaleString()}
            <button
              onClick={() => cancelAppointment(a.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>

      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
