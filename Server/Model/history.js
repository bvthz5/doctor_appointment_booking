const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class History extends Model {}

History.init(
  {
    id:{
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey : true
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "history",
  }
);


module.exports = History;
