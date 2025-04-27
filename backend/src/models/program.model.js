const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'programs',
  timestamps: true
});

module.exports = Program;
