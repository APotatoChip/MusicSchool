const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Class = sequelize.define("Class", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  price: { type: DataTypes.FLOAT },
  capacity: { type: DataTypes.INTEGER, defaultValue: 2 },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
});

// These will be added dynamically by Sequelize associations
// teacherId and classTypeId will be created when you do associations

module.exports = Class;
