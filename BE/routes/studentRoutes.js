const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new student
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    if (!firstName || !lastName || !email || !phone)
      return res.status(400).json({ message: "All fields are required" });

    const student = await Student.create({ firstName, lastName, email, phone });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
