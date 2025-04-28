const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");
const enrollmentController = require("../controllers/enrollment.controller");

router.get("/", programController.getAllPrograms);
router.post("/", programController.createProgram);
router.get("/:id", programController.getProgram);
router.get(
  "/:programId/enrollments",
  enrollmentController.getProgramEnrollments
);

module.exports = router;
