// routes/classTypesRoutes.js
const express = require("express");
const router = express.Router();
const ClassType = require("../models/classType");

// ✅ Get all class types
router.get("/", async (req, res) => {
  try {
    const types = await ClassType.findAll({ order: [["id", "ASC"]] });
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching class types" });
  }
});

// ✅ Create a new class type
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Class type name is required" });
    }

    const existing = await ClassType.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: "This class type already exists" });
    }

    const newType = await ClassType.create({ name: name.trim() });
    res.status(201).json(newType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating class type" });
  }
});

// ✅ Delete a class type
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ClassType.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Class type not found" });
    }

    res.json({ message: "Class type deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting class type" });
  }
});

module.exports = router;
