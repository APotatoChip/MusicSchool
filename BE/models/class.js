const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Teacher = require("./teacher");

const Class = sequelize.define("Class", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }, // e.g., "Piano Beginner"
  type: { type: DataTypes.STRING, allowNull: false }, // Piano, Guitar, Singing, etc.
  duration: { type: DataTypes.INTEGER, allowNull: false }, // in minutes
  price: { type: DataTypes.FLOAT, allowNull: false },
});

// Relation to teacher (optional)
Class.belongsTo(Teacher, { foreignKey: "teacherId" });

module.exports = Class;
