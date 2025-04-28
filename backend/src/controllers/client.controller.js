const { Client, Program } = require("../models");

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving clients" });
  }
};

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: "Error creating client" });
  }
};

// Get a single client
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        {
          model: Program,
          through: { attributes: ["enrollmentDate", "status", "notes"] },
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving client" });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.update(req.body);
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: "Error updating client" });
  }
};
