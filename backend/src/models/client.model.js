module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      client_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(50),
      },
      contact_number: {
        type: DataTypes.STRING(50),
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "client",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Client;
};
