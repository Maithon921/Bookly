import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../Model/userModel.js";

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
