const { Program, Client, Enrollment } = require("../models");

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll({
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch programs", error: error.message });
  }
};

// Get program by ID
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    return res.status(200).json(program);
  } catch (error) {
    console.error("Error fetching program:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch program", error: error.message });
  }
};

// Create new program
const createProgram = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Program name is required" });
    }

    const newProgram = await Program.create({
      name,
      description,
    });

    return res.status(201).json(newProgram);
  } catch (error) {
    console.error("Error creating program:", error);
    return res
      .status(500)
      .json({ message: "Failed to create program", error: error.message });
  }
};

// Update program
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.update({
      name,
      description,
    });

    return res.status(200).json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return res
      .status(500)
      .json({ message: "Failed to update program", error: error.message });
  }
};

// Delete program
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    await program.destroy();

    return res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting program:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete program", error: error.message });
  }
};

// Get program's clients
const getProgramClients = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id, {
      include: [
        {
          model: Client,
          through: { attributes: ["enrollment_date", "status", "notes"] },
        },
      ],
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    return res.status(200).json(program.Clients);
  } catch (error) {
    console.error("Error fetching program clients:", error);
    return res
      .status(500)
      .json({
        message: "Failed to fetch program clients",
        error: error.message,
      });
  }
};

module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getProgramClients,
};
