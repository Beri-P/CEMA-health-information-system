const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check route
app.get("/", (req, res) => {
  res.send("Health Information System API is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For testing
