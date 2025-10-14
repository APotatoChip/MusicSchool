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

  // GET /api/students?search=John
  router.get("/", async (req, res) => {
    const { search } = req.query;
    const where = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};
    const students = await Student.findAll({ where });
    res.json(students);
  });

  // POST /api/classes/:id/add-student
  router.post("/:id/add-student", async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;
    const cls = await Class.findByPk(id);
    const student = await Student.findByPk(studentId);
    await cls.addStudent(student);
    res.json({ success: true });
  });
});

module.exports = router;
