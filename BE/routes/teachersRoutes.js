const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");

// ✅ Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching teachers" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, classTypeId } = req.body;

    if (!firstName || !lastName || !email || !classTypeId)
      return res.status(400).json({ error: "Missing required fields" });

    const teacher = await Teacher.create({
      firstName,
      lastName,
      email,
      phone,
      ClassTypeId: classTypeId,
    });

    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating teacher" });
  }
});
module.exports = router;
