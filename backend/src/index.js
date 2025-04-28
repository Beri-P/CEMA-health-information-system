require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const { handleDuplicateEnrollments } = require("./config/migrations");
const clientRoutes = require("./routes/client.routes");
const programRoutes = require("./routes/program.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Error handling
app.use(errorHandler);

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Run migration to handle duplicates and add constraint
    const migrationSuccess = await handleDuplicateEnrollments();
    if (!migrationSuccess) {
      throw new Error("Migration failed");
    }

    // Sync other models
    await sequelize.sync();
    console.log("Database synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();
