const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class FacilityHospital extends Model {}

FacilityHospital.init(
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
    modelName: "facilityHospital",
  }
);

module.exports = FacilityHospital;
