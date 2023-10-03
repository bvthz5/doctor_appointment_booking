const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

const Package = require("./package");
const SpecialtyHospital = require("./specialtyHospitalModel");
const Doctor = require("./doctorModel");
const FacilityHospital = require("./facilityHospitalModel");
const ServiceHospitals = require("./serviceHospitalModal");
const HospitalTime = require("./hospitalTimeModel");

class Hospital extends Model {}

Hospital.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileKey: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "hospital",
  }
);

Hospital.hasMany(SpecialtyHospital);
SpecialtyHospital.belongsTo(Hospital);

Hospital.hasMany(Doctor);
Doctor.belongsTo(Hospital);

Hospital.hasMany(Package);
Package.belongsTo(Hospital);

Hospital.hasMany(FacilityHospital);
FacilityHospital.belongsTo(Hospital);

Hospital.hasMany(ServiceHospitals);
ServiceHospitals.belongsTo(Hospital);

Hospital.hasMany(HospitalTime)
HospitalTime.belongsTo(Hospital)

module.exports = Hospital;
