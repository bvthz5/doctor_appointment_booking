const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class UserPackage extends Model {}

UserPackage.init(
  {
   id : {
    type : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey : true
   },
   status : {
    type : DataTypes.INTEGER,
    allowNull : false
   }
  },
  {
    sequelize,
    modelName: "userpackage",
  }
);

module.exports = UserPackage;
