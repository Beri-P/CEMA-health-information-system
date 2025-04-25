const { Enrollment, Client, Program } = require("../models");

// Create new enrollment
const createEnrollment = async (req, res) => {
  try {
    const { client_id, program_id, enrollment_date, status, notes } = req.body;

    // Check if client exists
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Check if program exists
    const program = await Program.findByPk(program_id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      where: {
        client_id,
        program_id,
      },
    });

    if (existingEnrollment) {
      return res
        .status(409)
        .json({ message: "Client is already enrolled in this program" });
    }

    const newEnrollment = await Enrollment.create({
      client_id,
      program_id,
      enrollment_date: enrollment_date || new Date(),
      status: status || "active",
      notes,
    });

    return res.status(201).json(newEnrollment);
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return res
      .status(500)
      .json({ message: "Failed to create enrollment", error: error.message });
  }
};

// Update enrollment
const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { enrollment_date, status, notes } = req.body;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    await enrollment.update({
      enrollment_date,
      status,
      notes,
    });

    return res.status(200).json(enrollment);
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return res
      .status(500)
      .json({ message: "Failed to update enrollment", error: error.message });
  }
};

// Delete enrollment
const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    await enrollment.destroy();

    return res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete enrollment", error: error.message });
  }
};

// Get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [{ model: Client }, { model: Program }],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch enrollments", error: error.message });
  }
};

module.exports = {
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getAllEnrollments,
};
