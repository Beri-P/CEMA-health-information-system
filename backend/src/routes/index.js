const express = require("express");
const router = express.Router();

// Import route modules
const programRoutes = require("./program.routes");
const clientRoutes = require("./client.routes");
const enrollmentRoutes = require("./enrollment.routes");
const userRoutes = require("./user.routes");

// Use route modules
router.use("/programs", programRoutes);
router.use("/clients", clientRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/users", userRoutes);

module.exports = router;
