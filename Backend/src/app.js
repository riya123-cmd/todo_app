require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// ROUTES
// ==========================

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

// Authentication Routes
app.use("/api/auth", authRoutes);

// Todo Routes
app.use("/api", todoRoutes);

// ==========================
// DEFAULT ROUTE
// ==========================

app.get("/", (req, res) => {
    res.send("Backend Running");
});

// ==========================
// EXPORT APP
// ==========================

module.exports = app;