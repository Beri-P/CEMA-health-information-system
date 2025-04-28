const sequelize = require("../config/database");
const Client = require("./client.model");
const Program = require("./program.model");
const Enrollment = require("./enrollment.model");

// Set up associations
Client.belongsToMany(Program, {
  through: {
    model: Enrollment,
    unique: true, // Enforce unique client-program pairs
  },
  foreignKey: "clientId",
  otherKey: "programId",
});

Program.belongsToMany(Client, {
  through: {
    model: Enrollment,
    unique: true, // Enforce unique client-program pairs
  },
  foreignKey: "programId",
  otherKey: "clientId",
});

// Enrollment associations
Enrollment.belongsTo(Client, { foreignKey: "clientId" });
Enrollment.belongsTo(Program, { foreignKey: "programId" });

module.exports = {
  sequelize,
  Client,
  Program,
  Enrollment,
};
