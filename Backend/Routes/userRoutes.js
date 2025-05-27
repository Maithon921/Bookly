import express from "express";
import { getUserProfile, updateUserProfile } from "../Controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// GET and PUT require authentication
router.route("/:id")
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateUserProfile);

export default router;
