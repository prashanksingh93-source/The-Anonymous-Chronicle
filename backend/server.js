const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const postRoutes = require("./routes/post.route");
const fundingRoutes = require("./routes/funding.route");
const authRoutes = require("./routes/auth.route");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

// -----------------------------
// Allowed Frontend Origins
// -----------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://the-anonymous-chronicle-3mr3.vercel.app",
];

// -----------------------------
// CORS
// -----------------------------

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// -----------------------------
// Body Parser
// -----------------------------

app.use(express.json({ limit: "5mb" }));

// -----------------------------
// Health Check
// -----------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Anonymous Chronicle API is running",
  });
});

// -----------------------------
// Routes
// -----------------------------

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/funding", fundingRoutes);

// -----------------------------
// MongoDB Connection
// -----------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });