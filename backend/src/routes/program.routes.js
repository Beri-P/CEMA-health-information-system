const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");

// Get all programs
router.get("/", programController.getAllPrograms);

// Get program by ID
router.get("/:id", programController.getProgramById);

// Create new program
router.post("/", programController.createProgram);

// Update program
router.put("/:id", programController.updateProgram);

// Delete program
router.delete("/:id", programController.deleteProgram);

// Get program's clients
router.get("/:id/clients", programController.getProgramClients);

module.exports = router;
