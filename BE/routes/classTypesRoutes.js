const express = require("express");
const router = express.Router();
const ClassType = require("../models/classType");

// ✅ Get all class types
router.get("/", async (req, res) => {
  try {
    const types = await ClassType.findAll();
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching class types" });
  }
});

// ✅ Create new class type
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newType = await ClassType.create({ name });
    res.status(201).json(newType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating class type" });
  }
});

module.exports = router;
