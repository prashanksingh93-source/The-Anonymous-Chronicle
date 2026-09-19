const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Admin = require("./models/admin.model");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "admin@example.com";
    const password = "admin123";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Create admin error:", error);
    process.exit(1);
  }
};

createAdmin();

