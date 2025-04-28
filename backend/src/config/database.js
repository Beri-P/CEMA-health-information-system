const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelizeConfig;

if (process.env.DATABASE_URL) {
  // Use connection URL if provided (mainly for docker)
  sequelizeConfig = {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    logging: false,
  };
} else {
  // Use individual environment variables
  sequelizeConfig = {
    dialect: process.env.DB_DIALECT || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "cema_db",
    logging: false,
  };
}

const sequelize = new Sequelize(sequelizeConfig);

module.exports = sequelize;
