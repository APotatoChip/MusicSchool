const express = require("express");
const app = express();
const cors = require("cors");
const { Teacher, Class, ClassType, Student } = require("./models"); // 🔹 import models with associations
const sequelize = require("./config/db");
const classTypesRoutes = require("./routes/classTypesRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classesRoutes = require("./routes/classesRoutes");
const teachersRoutes = require("./routes/teachersRoutes");
app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/class-types", classTypesRoutes);

sequelize.sync({ force: true }).then(() => {
  console.log("✅ Database synced");
  app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
  );
});
