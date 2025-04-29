import express from "express";
import { signup, signin, getProfile, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/profile", authMiddleware, getProfile);

router.put("/update", authMiddleware, updateProfile);

export default router;
