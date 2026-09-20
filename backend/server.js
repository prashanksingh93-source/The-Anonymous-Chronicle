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

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// -----------------------------
// CORS
// -----------------------------

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
  })
);

// -----------------------------
// Body parser
// -----------------------------

app.use(express.json({ limit: "5mb" }));

// -----------------------------
// Health check
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
// MongoDB
// -----------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error
    );
  });