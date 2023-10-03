const { Sequelize } = require("sequelize");
const logger = require("./logger");
require("dotenv").config();

const DATABASE_NAME = process.env.DATABASE_NAME;
const USER_NAME = process.env.USER_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DATABASE_NAME, USER_NAME, DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info("Database connected");
  })
  .catch((err) => {
    logger.error("error", err);
  });

sequelize.sync({ force: false, alter: "update" }).then(() => {
  logger.debug("Database tables synchronized");
});

module.exports = sequelize; 
