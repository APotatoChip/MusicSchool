const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const Student = require("./models/student"); // import model

dotenv.config();
const app = express();

app.use(express.json()); // for JSON requests

// Routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("Music Classes API is running 🎶");
});

// Import routes
// const studentRoutes = require('./routes/studentRoutes');
// app.use('/api/students', studentRoutes);

// Connect DB and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));
