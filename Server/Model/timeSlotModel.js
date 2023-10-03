const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const Booking = require('./bookingModel');
const Leave = require('./leaveModel');
const HospitalTime = require('./hospitalTimeModel');
const DoctorTime = require('./doctorTimeModel');

class TimeSlot extends Model { }

TimeSlot.init({
    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    timeSlot: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'timeslot'
});

TimeSlot.hasMany(Booking)
Booking.belongsTo(TimeSlot)

TimeSlot.hasMany(Leave)
Leave.belongsTo(TimeSlot)

TimeSlot.hasMany(HospitalTime)
HospitalTime.belongsTo(TimeSlot)

TimeSlot.hasMany(DoctorTime)
DoctorTime.belongsTo(TimeSlot)


module.exports = TimeSlot;

