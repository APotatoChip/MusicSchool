// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import CreateClass from "./pages/CreateClass";
import CreateTeacher from "./pages/CreateTeacher";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/schedule" element={<Dashboard />} />
        <Route path="/create-class" element={<CreateClass />} />
        <Route path="/students" element={<Students />} />
        <Route path="/create-teacher" element={<CreateTeacher />} />
      </Routes>
    </Router>
  );
}

export default App;
