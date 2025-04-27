const { Program } = require('../models');

// Get all programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving programs' });
  }
};

// Create a new program
exports.createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (err) {
    res.status(400).json({ message: 'Error creating program' });
  }
};

// Get a single program
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving program' });
  }
};
