// models/classType.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ClassType = sequelize.define("ClassType", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = ClassType;
