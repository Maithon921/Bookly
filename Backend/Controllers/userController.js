import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

// SIGN UP
export const signUp = async (req, res) => {
  try {
    const { name, email, password, profilePic, isAdmin } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminVerify = isAdmin === process.env.ADMIN_CODE ? true : false;

    // Create new user
    const newUser = new User({
      name,
      email,
      isAdmin: adminVerify,
      password: hashedPassword,
      profilePic:
        profilePic ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMU8xN7Eomz1Bh06wEOhEyvHi06UGtAakVA&s",
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        profilePic: newUser.profilePic,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const logIn = async (req, res) => {
    
};




// GET /users/:id - Retrieve user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /users/:id - Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, profilePic } = req.body;

    // Only allow self or admin to update
    if (req.user.id !== req.params.id && req.user.isAdmin !== true) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
