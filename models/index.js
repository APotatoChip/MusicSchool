const Student = require("./student");
const Class = require("./class");

// Many-to-Many: students ↔ classes
Student.belongsToMany(Class, {
  through: "StudentClasses",
  foreignKey: "studentId",
});
Class.belongsToMany(Student, {
  through: "StudentClasses",
  foreignKey: "classId",
});

module.exports = { Student, Class };
