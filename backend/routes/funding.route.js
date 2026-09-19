const express = require("express");

const {
  saveFunding,
  getFunding,
} = require("../controllers/funding.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Public route
router.get("/", getFunding);

// Admin-only route
router.post("/", authMiddleware, saveFunding);

module.exports = router;

