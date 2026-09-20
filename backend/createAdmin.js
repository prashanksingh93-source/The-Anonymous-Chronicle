const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Admin = require("./models/admin.model");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "annu@gmail.com";
    const password = "annu@123";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      existingAdmin.password = await bcrypt.hash(
        password,
        10
      );

      await existingAdmin.save();

      console.log("Admin password reset successfully");
    } else {
      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      await Admin.create({
        email,
        password: hashedPassword,
      });

      console.log("Admin created successfully");
    }

    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Create admin error:", error);
  }
};

createAdmin();