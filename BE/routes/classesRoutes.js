const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Class = require("../models/class");
const Student = require("../models/student");
const StudentClass = require("../models/studentClass");

// GET /api/classes?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const where = date ? { date } : {};
    const classes = await Class.findAll({
      where,
      include: [{ model: Student }],
    });
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching classes" });
  }
});

// POST /api/classes/:id/add-student
router.post("/:id/add-student", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const cls = await Class.findByPk(id);
    const student = await Student.findByPk(studentId);
    if (!cls || !student)
      return res.status(404).json({ error: "Class or student not found" });

    await cls.addStudent(student);
    res.json({ message: "Student added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding student" });
  }
});

// POST /api/classes  → create a new class
router.post("/", async (req, res) => {
  try {
    const { teacherId, classTypeId, price, capacity, date, time } = req.body;

    // Validate required fields
    if (!teacherId || !classTypeId || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(teacherId, classTypeId, price, capacity, date, time);
    const newClass = await Class.create({
      teacherId,
      classTypeId,
      price,
      capacity,
      date,
      time,
    });

    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating class" });
  }
});

// DELETE /api/classes/:id/remove-student/:studentId
router.delete("/:id/remove-student/:studentId", async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const cls = await Class.findByPk(id);
    const student = await Student.findByPk(studentId);
    if (!cls || !student)
      return res.status(404).json({ error: "Class or student not found" });

    await cls.removeStudent(student);
    res.json({ message: "Student removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing student" });
  }
});

// POST /api/classes/:id/payment
router.post("/:id/payment", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, method } = req.body;

    // mock only
    res.json({
      message: `Payment by ${method} received for student ${studentId} in class ${id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing payment" });
  }
});

module.exports = router;
