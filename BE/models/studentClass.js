const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student");
const Class = require("./class");

const StudentClass = sequelize.define("StudentClass", {
  paid: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Student.belongsToMany(Class, { through: StudentClass });
Class.belongsToMany(Student, { through: StudentClass });

module.exports = StudentClass;
