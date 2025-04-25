const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// Import models
const User = require("./user.model")(sequelize, DataTypes);
const Client = require("./client.model")(sequelize, DataTypes);
const Program = require("./program.model")(sequelize, DataTypes);
const Enrollment = require("./enrollment.model")(sequelize, DataTypes);

// Define associations
Client.belongsToMany(Program, { through: Enrollment });
Program.belongsToMany(Client, { through: Enrollment });

Client.hasMany(Enrollment);
Enrollment.belongsTo(Client);

Program.hasMany(Enrollment);
Enrollment.belongsTo(Program);

// Export models
module.exports = {
  sequelize,
  User,
  Client,
  Program,
  Enrollment,
};
