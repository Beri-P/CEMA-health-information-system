const sequelize = require('../config/database');
const Client = require('./client.model');
const Program = require('./program.model');
const Enrollment = require('./enrollment.model');

// Set up associations after all models are loaded
Client.belongsToMany(Program, { 
  through: {
    model: Enrollment,
    unique: false
  },
  foreignKey: 'clientId',
  otherKey: 'programId'
});

Program.belongsToMany(Client, { 
  through: {
    model: Enrollment,
    unique: false
  },
  foreignKey: 'programId',
  otherKey: 'clientId'
});

// Enrollment associations
Enrollment.belongsTo(Client, { foreignKey: 'clientId' });
Enrollment.belongsTo(Program, { foreignKey: 'programId' });

module.exports = {
  sequelize,
  Client,
  Program,
  Enrollment
};
