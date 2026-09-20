const express = require("express");

const {
  loginAdmin,
  verifyAdmin,
  changePassword,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Verify admin token
router.get("/verify", authMiddleware, verifyAdmin);

// Change admin password
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;