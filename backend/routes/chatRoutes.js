import express from "express";
import { askChat, resetChat } from "../controllers/skinController.js";

const router = express.Router();

router.post("/ask", askChat);
router.post("/reset", resetChat);

export default router;
