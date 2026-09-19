const express = require("express");

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Public
router.get("/", getPosts);

// Admin only
router.post("/", authMiddleware, createPost);

router.put("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;