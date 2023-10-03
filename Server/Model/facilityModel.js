const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const FacilityHospital = require("./facilityHospitalModel");

class Facility extends Model {}

Facility.init(
  {
    facilityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "facility",
  }
);

Facility.hasMany(FacilityHospital);
FacilityHospital.belongsTo(Facility);

module.exports = Facility;
