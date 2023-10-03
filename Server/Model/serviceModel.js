const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const ServiceHospitals = require("./serviceHospitalModal");

class Service extends Model {}

Service.init(
  {
    serviceName: {
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
    modelName: "service",
  }
);

Service.hasMany(ServiceHospitals);
ServiceHospitals.belongsTo(Service);

module.exports = Service;
