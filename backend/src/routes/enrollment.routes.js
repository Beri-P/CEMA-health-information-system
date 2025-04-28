const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollment.controller");

router.post("/", enrollmentController.createEnrollment);
router.get("/client/:clientId", enrollmentController.getClientEnrollments);
router.put("/:id/status", enrollmentController.updateEnrollmentStatus);
router.delete("/:id", enrollmentController.deleteEnrollment); // Add delete route

module.exports = router;
