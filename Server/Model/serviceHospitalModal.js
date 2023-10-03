const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class ServiceHospitals extends Model {}

ServiceHospitals.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "serviceHospitals",
  }
);

module.exports = ServiceHospitals;
