const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Service = require("./serviceModel");
const Facility = require("./facilityModel");
const Doctor = require("./doctorModel");
const SpecialtyHospital = require("./specialtyHospitalModel");

class SubSpecialty extends Model {}

SubSpecialty.init(
  {
    SubSpecialtyName: {
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
    modelName: "subspecialty",
  }
);

SubSpecialty.hasMany(Doctor);
Doctor.belongsTo(SubSpecialty);

SubSpecialty.hasMany(SpecialtyHospital);
SpecialtyHospital.belongsTo(SubSpecialty);

module.exports = SubSpecialty;
