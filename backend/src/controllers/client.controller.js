const { Client, Program, Enrollment } = require("../models");

// Get all clients with search functionality
const getAllClients = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${search}%` } },
          { last_name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const clients = await Client.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch clients", error: error.message });
  }
};

// Get client by ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [
        {
          model: Program,
          through: { attributes: ["enrollment_date", "status", "notes"] },
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch client", error: error.message });
  }
};

// Create new client
const createClient = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number,
      email,
      address,
    } = req.body;

    // Basic validation
    if (!first_name || !last_name || !date_of_birth) {
      return res
        .status(400)
        .json({
          message: "First name, last name, and date of birth are required",
        });
    }

    const newClient = await Client.create({
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number,
      email,
      address,
    });

    return res.status(201).json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    return res
      .status(500)
      .json({ message: "Failed to create client", error: error.message });
  }
};

// Update client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number,
      email,
      address,
    } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.update({
      first_name,
      last_name,
      date_of_birth,
      gender,
      contact_number,
      email,
      address,
    });

    return res.status(200).json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return res
      .status(500)
      .json({ message: "Failed to update client", error: error.message });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.destroy();

    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete client", error: error.message });
  }
};

// Get client's programs
const getClientPrograms = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [
        {
          model: Program,
          through: { attributes: ["enrollment_date", "status", "notes"] },
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json(client.Programs);
  } catch (error) {
    console.error("Error fetching client programs:", error);
    return res
      .status(500)
      .json({
        message: "Failed to fetch client programs",
        error: error.message,
      });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientPrograms,
};
