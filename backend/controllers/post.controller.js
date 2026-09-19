const Post = require("../models/post.model");

// Create post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const post = await Post.create({
      title,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};