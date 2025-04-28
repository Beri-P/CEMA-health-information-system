const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    enrollmentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "enrollment_id",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "id",
      },
      field: "client_id",
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "programs",
        key: "id",
      },
      field: "program_id",
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "enrollment_date",
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "active",
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "enrollment",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Enrollment;
