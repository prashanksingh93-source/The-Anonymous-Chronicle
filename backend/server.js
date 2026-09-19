const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route");

const postRoutes = require("./routes/post.route");
const fundingRoutes = require("./routes/funding.route");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "5mb" }));

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Anonymous Chronicle API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/funding", fundingRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

