const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Booking = require('./bookingModel');
const TimeSlot = require('./timeSlotModel');
const UserPackage = require('./userPackages');


class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName : {
    type : DataTypes.STRING,
  },
  lastName : {
    type : DataTypes.STRING
  },
  email : {
    type : DataTypes.STRING,
    allowNull : false,
    unique : true
  },
  dob : {
    type : DataTypes.DATEONLY,
  },
  gender : {
    type : DataTypes.STRING,
  },
  mobileNo : {
    type : DataTypes.STRING
  },
  otp : {
    type : DataTypes.STRING,
    allowNull : false
  },
  validity : {
    type : DataTypes.DATE,
    allowNull :  false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'user'
});

User.hasMany(Booking)
Booking.belongsTo(User)

User.hasMany(UserPackage)
UserPackage.belongsTo(User)

module.exports = User;
