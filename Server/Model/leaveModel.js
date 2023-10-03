const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const TimeSlot = require("./timeSlotModel");

class Leave extends Model {}

Leave.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "leave",
  }
);

module.exports = Leave;
