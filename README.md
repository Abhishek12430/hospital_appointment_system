# Hospital Appointment System

A simple full-stack Hospital Appointment System with **Patient** and **Doctor** roles. Patients can register/login and book appointments with doctors. Doctors can register/login and view or cancel appointments booked with them.

---

## Features

* User registration (patient or doctor) with hashed passwords
* User login with JWT token (simple session handling)
* Patients:

  * See list of doctors
  * Book appointments (date & time)
  * Logout
* Doctors:

  * View appointments booked with them
  * Cancel appointments
  * Logout
* MySQL (InnoDB) database with foreign key constraints

---

## Tech Stack

* Frontend: React (Vite)
* Backend: Node.js, Express
* Database: MySQL (InnoDB)
* HTTP client: Axios
* Auth: JWT (simple usage) + bcrypt for password hashing

---

## Database Schema

```sql
CREATE DATABASE hospitals;
USE hospitals;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  role ENUM('patient','doctor') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
) ENGINE=InnoDB;
```

---

## Backend - Setup

1. Navigate to the `server` (or backend) folder.
2. Install dependencies:

```bash
npm install express cors mysql2 bcryptjs jsonwebtoken
```

3. Create a `.env` (or set variables) for DB and JWT:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hospitals
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Example minimal `server.js` (conceptually):

* Connect to MySQL using `mysql2/promise`.
* Routes:

  * `POST /register` → register user (hash password)
  * `POST /login` → login and return JWT + user
  * `GET /doctors` → return list of users where role='doctor'
  * `POST /appointments` → create appointment
  * `GET /appointments/:doctorId` → get appointments for a doctor (includes patient name)
  * `DELETE /appointments/:id` → cancel/delete appointment

> Ensure you `console.error(err)` in catches to see real errors (helps debug 500s).

---

## Frontend - Setup

1. Create a Vite React app (or use provided client):

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install axios
```

2. Keep a simple app structure:

```
src/
  App.jsx
  components/
    Register.jsx
    Login.jsx
    PatientDashboard.jsx
    DoctorDashboard.jsx
```

3. Important behavior:

* After login, save `user` and `token` in `localStorage`.
* Use `user.role` to decide which dashboard to show.
* Clear `localStorage` on logout and refresh or update parent state.

---

## API Endpoints (summary)

* `POST /register` — body: `{ username, password, role }`
* `POST /login` — body: `{ username, password }` → returns `{ token, user }`
* `GET /doctors` — returns `[ { id, username } ]`
* `POST /appointments` — body: `{ patient_id, doctor_id, appointment_date }`
* `GET /appointments/:doctorId` — returns appointments with patient name
* `DELETE /appointments/:id` — deletes appointment

---

## Common Troubleshooting

* **500 Internal Server Error (on register/login)**: check backend console — typical causes: DB not selected (`USE hospitals;`), duplicate username (unique constraint), or DB connection config mismatch.
* **Foreign key errors**: ensure both tables use `ENGINE=InnoDB` and referenced columns match types.
* **CORS issues**: enable `cors()` middleware in Express.

---

## Testing

* Insert sample users and appointment via SQL or register via frontend:

```sql
INSERT INTO users (username, `password`, role) VALUES ('dr_john', '<hashed>', 'doctor');
INSERT INTO users (username, `password`, role) VALUES ('alice', '<hashed>', 'patient');
```

* Use Postman or frontend to test endpoints.

---

## Next Improvements

* Protect routes using JWT middleware (verify token, restrict actions)
* Add validation (server-side) for appointment date/time conflicts
* Add pagination & search for doctors
* Improve UI/UX and error handling on frontend
* Use environment-specific DB (Docker or cloud DB) for deployments

---

## License

This project is MIT licensed — adapt as you like.

---

If you want, I can:

* Add a downloadable `server.js` & `client` example files to the repo
* Convert this README into a GitHub-ready `README.md` file and add badges
* Create `Postman` collection for quick testing

Which would you like next?
