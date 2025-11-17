// server.js
const connectDB = require("./db");
connectDB(); // Connect to MongoDB

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session (optional)
app.use(session({
  secret: process.env.SESSION_SECRET || "library-management-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// API Routes ONLY
app.use("/api/auth", authRoutes);

// Health check (for Kubernetes probes)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// No frontend serving in backend
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running. Use /api/auth routes."
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
