import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Abhi@2025#Sql!Bh@ti",
      database: "hospitals"
    });
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
})();

const JWT_SECRET = "secret123"; // use .env in production

// Register
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "User already exists or DB error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "All fields required" });
  }
  const [rows] = await db.execute("SELECT * FROM users WHERE username=?", [
    username
  ]);
  if (rows.length === 0) return res.status(401).json({ error: "Invalid user" });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Get Doctors
app.get("/doctors", async (req, res) => {
  const [doctors] = await db.execute(
    "SELECT id, username FROM users WHERE role='doctor'"
  );
  res.json(doctors);
});

// Book Appointment (Patient)
app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_date } = req.body;
  if (!patient_id || !doctor_id || !appointment_date) {
    return res.status(400).json({ error: "All fields required" });
  }
  await db.execute(
    "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
    [patient_id, doctor_id, appointment_date]
  );
  res.json({ success: true, message: "Appointment booked" });
});

// Get Doctor's Appointments
app.get("/appointments/:doctorId", async (req, res) => {
  const doctorId = req.params.doctorId;
  const [appointments] = await db.execute(
    `SELECT a.id, u.username as patient_name, a.appointment_date
     FROM appointments a
     JOIN users u ON a.patient_id = u.id
     WHERE a.doctor_id=?`,
    [doctorId]
  );
  res.json(appointments);
});

// Cancel Appointment
app.delete("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM appointments WHERE id=?", [id]);
    res.json({ success: true, message: "Appointment cancelled" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
