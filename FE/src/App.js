// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import CreateClass from "./pages/CreateClass";
import CreateTeacher from "./pages/CreateTeacher";
import Dashboard from "./pages/Dashboard";
import CreateClassType from "./pages/CreateClassType";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-type" element={<CreateClassType />} />
        <Route path="/create-class" element={<CreateClass />} />
        <Route path="/students" element={<Students />} />
        <Route path="/create-teacher" element={<CreateTeacher />} />
      </Routes>
    </Router>
  );
}

export default App;
