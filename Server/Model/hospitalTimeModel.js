const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class HospitalTime extends Model {}

HospitalTime.init(
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
    modelName: "hospitalTimeSlot",
  }
);

module.exports = HospitalTime;
