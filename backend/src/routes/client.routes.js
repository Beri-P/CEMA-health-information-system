const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");

// Get all clients
router.get("/", clientController.getAllClients);

// Get client by ID
router.get("/:id", clientController.getClientById);

// Create new client
router.post("/", clientController.createClient);

// Update client
router.put("/:id", clientController.updateClient);

// Delete client
router.delete("/:id", clientController.deleteClient);

// Get client's programs
router.get("/:id/programs", clientController.getClientPrograms);

module.exports = router;
