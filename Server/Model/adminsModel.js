const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const Hospital = require("./hospitalModel");

class Admin extends Model {}

Admin.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
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
    modelName: "admin",
  }
);

Admin.hasMany(Hospital);
Hospital.belongsTo(Admin);

module.exports = Admin;
