const { Enrollment, Client, Program } = require('../models');

// Create a new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    const { clientId, programId } = req.body;
    const enrollment = await Enrollment.create({
      clientId,
      programId,
      enrollmentDate: new Date(),
      status: 'active'
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating enrollment' });
  }
};

// Get enrollments by client
exports.getClientEnrollments = async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId, 10);
    const enrollments = await Enrollment.findAll({
      where: { clientId },
      include: [Program]
    });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving enrollments' });
  }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enrollmentId = parseInt(req.params.id, 10);
    const enrollment = await Enrollment.findByPk(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    const updatedEnrollment = await enrollment.update({ status });
    res.json(updatedEnrollment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating enrollment status' });
  }
};
