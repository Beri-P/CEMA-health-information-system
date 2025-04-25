module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      enrollment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "client",
          key: "client_id",
        },
      },
      program_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "program",
          key: "program_id",
        },
      },
      enrollment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["client_id", "program_id"],
        },
      ],
    }
  );

  return Enrollment;
};
