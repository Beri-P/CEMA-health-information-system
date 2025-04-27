const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Prometheus844',
  database: 'health_system',
  logging: false
});

module.exports = sequelize;
