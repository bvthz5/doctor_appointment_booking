const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class SpecialtyHospital extends Model {}

SpecialtyHospital.init(
  {
    id: {
        type : DataTypes.INTEGER,
        allowNull:false,
        autoIncrement : true,
        primaryKey : true
    },
    status: {
      type : DataTypes.INTEGER,
      allowNull:false,
      
  }
  },
  {
    sequelize,
    modelName: "specialtyHospitals",
  }
);



module.exports = SpecialtyHospital;
