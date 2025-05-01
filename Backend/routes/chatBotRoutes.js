// src/routes/chatBotRoutes.js
import express from "express";
import { getChatBotSettings, saveOrUpdateChatBotSettings } from "../controllers/chatBotSettingsController.js";

const router = express.Router();

router.get("/chatbot-settings", getChatBotSettings);
router.post("/chatbot-settings", saveOrUpdateChatBotSettings);

export default router;
