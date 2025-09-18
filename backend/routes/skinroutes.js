import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkresultuser, getAnalysisForUser, skinanalysis } from '../controllers/skinController.js';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", protect, skinanalysis);  //working
router.get("/result", protect, getAnalysisForUser );  //working
router.get("/check", protect, checkresultuser);


export default router;