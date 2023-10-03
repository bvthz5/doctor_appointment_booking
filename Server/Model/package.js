const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");
const UserPackage = require("./userPackages");

class Package extends Model {}

Package.init(
  {
    packageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validity: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    off : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    version: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "package",
  }
);

Package.hasMany(UserPackage)
UserPackage.belongsTo(Package)

module.exports = Package;
