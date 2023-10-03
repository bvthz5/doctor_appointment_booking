const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const History = require("./history");

class Booking extends Model {}

Booking.init(
  {
    id:{
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "booking",
  }
);


Booking.addScope('distinctUserId', {
  attributes: [
    'userId',
    [sequelize.fn('COUNT', sequelize.col('userId')), 'bookingCount'],
  ],
  group: ['userId'],
  raw: true,
});
Booking.addScope('distinctDoctorId', {
  attributes: [
    'doctorId',
    [sequelize.fn('COUNT', sequelize.col('doctorId')), 'bookingCount'],
  ],
  group: ['doctorId'],
  raw: true,
});
Booking.hasMany(History)
History.belongsTo(Booking)

module.exports = Booking;
