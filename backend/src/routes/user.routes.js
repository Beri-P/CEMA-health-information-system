const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register new user
router.post("/register", userController.register);

// Login user
router.post("/login", userController.login);

// Get user profile (protected route)
router.get("/profile", authMiddleware.verifyToken, userController.getProfile);

module.exports = router;
