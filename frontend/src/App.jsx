import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  return (
    <div>
      {!user ? (
        <>
          <Register />
          <Login setUser={setUser} />
        </>
      ) : user.role === "patient" ? (
        <PatientDashboard user={user} />
      ) : (
        <DoctorDashboard user={user} />
      )}
    </div>
  );
}

export default App;
