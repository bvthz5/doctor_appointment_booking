  const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const SubSpecialty = require("./subSpecialtyModel");
const Doctor = require("./doctorModel");
const SpecialtyHospital = require("./specialtyHospitalModel");

class Specialty extends Model {}

Specialty.init(
  {
    specialtyName: {
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
  },
  {
    sequelize,
    modelName: "specialty",
  }
);

Specialty.hasMany(SubSpecialty);
SubSpecialty.belongsTo(Specialty);

Specialty.hasMany(Doctor);
Doctor.belongsTo(Specialty);

SubSpecialty.hasMany(Doctor)
Doctor.belongsTo(SubSpecialty)

Specialty.hasMany(SpecialtyHospital)
SpecialtyHospital.belongsTo(Specialty)

module.exports = Specialty;
