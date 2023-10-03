const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class DoctorTime extends Model {}

DoctorTime.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "doctorTimeSlot",
  }
);

module.exports = DoctorTime;
