const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");

// Enroll client in program
router.post("/", enrollmentController.createEnrollment);

// Update enrollment
router.put("/:id", enrollmentController.updateEnrollment);

// Remove enrollment
router.delete("/:id", enrollmentController.deleteEnrollment);

// Get all enrollments
router.get("/", enrollmentController.getAllEnrollments);

module.exports = router;
