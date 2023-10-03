const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Blog = require('./blogModel');
const Booking = require('./bookingModel');
const Leave = require('./leaveModel');
const DoctorTime = require('./doctorTimeModel');


class Doctor extends Model {}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageKey: {
      type: DataTypes.STRING,
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
    modelName: "doctor",
  }
);




Doctor.hasMany(Blog)
Blog.belongsTo(Doctor)

Doctor.hasMany(Booking)
Booking.belongsTo(Doctor)

Doctor.hasMany(Leave)
Leave.belongsTo(Doctor)

Doctor.hasMany(DoctorTime)
DoctorTime.belongsTo(Doctor)

module.exports = Doctor;
