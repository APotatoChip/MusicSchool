const sequelize = require("../config/db");
const Teacher = require("./teacher");
const Student = require("./student");
const Class = require("./class");
const ClassType = require("./classType");

// === Associations ===
Teacher.hasMany(Class, {
  foreignKey: { name: "teacherId", allowNull: false },
  onDelete: "CASCADE",
});
Class.belongsTo(Teacher, {
  foreignKey: { name: "teacherId", allowNull: false },
  onDelete: "CASCADE",
});

ClassType.hasMany(Class, {
  foreignKey: { name: "classTypeId", allowNull: false },
  onDelete: "CASCADE",
});
Class.belongsTo(ClassType, {
  foreignKey: { name: "classTypeId", allowNull: false },
  onDelete: "CASCADE",
});

ClassType.hasMany(Teacher);
Teacher.belongsTo(ClassType);

// Many-to-Many: Students ↔ Classes
Student.belongsToMany(Class, {
  through: "StudentClasses",
  foreignKey: "studentId",
});
Class.belongsToMany(Student, {
  through: "StudentClasses",
  foreignKey: "classId",
});

module.exports = { sequelize, Teacher, Student, Class, ClassType };
