const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Class = require("../models/class");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const ClassType = require("../models/classType");
const StudentClass = require("../models/studentClass");

// GET /api/classes?date=YYYY-MM-DD
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const where = date ? { date } : {};

    const classes = await Class.findAll({
      where,
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] }, // Hide join table
        },
        {
          model: Teacher,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ClassType,
          attributes: ["id", "name"],
        },
      ],
    });

    // ✅ Format the data for easier frontend use
    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      date: cls.date,
      time: cls.time,
      price: cls.price,
      capacity: cls.capacity,
      teacherName: cls.Teacher
        ? cls.Teacher.firstName
          ? `${cls.Teacher.firstName} ${cls.Teacher.lastName}`
          : cls.Teacher.name
        : null,
      classTypeName: cls.ClassType ? cls.ClassType.name : null,
      students:
        cls.Students?.map((s) => ({
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
        })) || [],
    }));

    res.json(formattedClasses);
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
    res.json(student);
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

// DELETE /api/classes/:classId/students/:studentId → remove student from class
router.delete("/:classId/students/:studentId", async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    console.log("hi");
    const classObj = await Class.findByPk(classId);
    if (!classObj) return res.status(404).json({ error: "Class not found" });

    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    await classObj.removeStudent(student);

    // Return the updated class with students
    const updatedClass = await Class.findByPk(classId, {
      include: [
        {
          model: Student,
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] },
        },
        { model: Teacher, attributes: ["id", "firstName", "lastName"] },
        { model: ClassType, attributes: ["id", "name"] },
      ],
    });

    const formattedClass = {
      id: updatedClass.id,
      date: updatedClass.date,
      time: updatedClass.time,
      price: updatedClass.price,
      capacity: updatedClass.capacity,
      teacherName: updatedClass.Teacher
        ? updatedClass.Teacher.firstName
          ? `${updatedClass.Teacher.firstName} ${updatedClass.Teacher.lastName}`
          : updatedClass.Teacher.name
        : null,
      classTypeName: updatedClass.ClassType
        ? updatedClass.ClassType.name
        : null,
      students:
        updatedClass.Students?.map((s) => ({
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
        })) || [],
    };

    res.json(formattedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing student from class" });
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
