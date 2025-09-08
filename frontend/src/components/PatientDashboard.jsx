import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PatientDashboard({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", appointment_date: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/doctors").then((res) => setDoctors(res.data));
  }, []);

  const bookAppointment = async () => {
    if (!form.doctor_id || !form.appointment_date) {
      alert("Please select a doctor and date");
      return;
    }
    await axios.post("http://localhost:5000/appointments", {
      patient_id: user.id,
      doctor_id: form.doctor_id,
      appointment_date: form.appointment_date
    });
    alert("✅ Appointment booked!");
    setForm({ doctor_id: "", appointment_date: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // instead of reload
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <select
        value={form.doctor_id}
        onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
      >
        <option value="" disabled>Select Doctor</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.username}
          </option>
        ))}
      </select>
      <input
        type="datetime-local"
        value={form.appointment_date}
        onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
      />
      <button onClick={bookAppointment}>Book</button>

      <hr />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
