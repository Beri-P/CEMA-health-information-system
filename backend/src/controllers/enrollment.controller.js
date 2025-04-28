const { Enrollment, Client, Program } = require("../models");

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { clientId, programId } = req.body;

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      where: {
        clientId,
        programId,
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "Client is already enrolled in this program",
      });
    }

    const enrollment = await Enrollment.create({
      clientId,
      programId,
      enrollmentDate: new Date(),
      status: "active",
    });

    const enrollmentWithProgram = await Enrollment.findOne({
      where: { enrollmentId: enrollment.enrollmentId },
      include: [Program],
    });

    res.status(201).json(enrollmentWithProgram);
  } catch (err) {
    console.error("Error creating enrollment:", err);
    res.status(400).json({ message: "Error creating enrollment" });
  }
};

// Get enrollments by client
exports.getClientEnrollments = async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId, 10);
    const enrollments = await Enrollment.findAll({
      where: { clientId },
      include: [
        {
          model: Program,
          required: true, // This ensures INNER JOIN
        },
      ],
      order: [["enrollmentDate", "DESC"]],
    });
    res.json(enrollments);
  } catch (err) {
    console.error("Error retrieving enrollments:", err);
    res.status(500).json({ message: "Error retrieving enrollments" });
  }
};

// Get enrollments by program
exports.getProgramEnrollments = async (req, res) => {
  try {
    const programId = parseInt(req.params.programId, 10);
    const enrollments = await Enrollment.findAll({
      where: { programId },
      include: [
        {
          model: Client,
          required: true,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "dateOfBirth",
            "phone",
            "email",
          ],
        },
      ],
      order: [["enrollmentDate", "DESC"]],
    });
    res.json(enrollments);
  } catch (err) {
    console.error("Error retrieving program enrollments:", err);
    res.status(500).json({ message: "Error retrieving program enrollments" });
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const updatedEnrollment = await enrollment.update({ status });
    res.json(updatedEnrollment);
  } catch (err) {
    console.error("Error updating enrollment status:", err);
    res.status(400).json({ message: "Error updating enrollment status" });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    await enrollment.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting enrollment:", err);
    res.status(500).json({ message: "Error deleting enrollment" });
  }
};
