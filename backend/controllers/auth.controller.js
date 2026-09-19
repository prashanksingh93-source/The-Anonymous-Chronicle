const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Register admin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login admin error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};

