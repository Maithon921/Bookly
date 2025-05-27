import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./Routes/userRoutes.js"

dotenv.config();
const app = new express();
app.use(express.json());
mongoose.connect();

const db = mongoose.connection;

db.on("connect", () => {
  console.log("Database Connected");
});

db.on("error", () => {
  console.log("Failed to connect database");
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
