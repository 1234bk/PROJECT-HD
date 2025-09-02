import express from 'express';
import {   resendOTP, sendSigninOTP, signin, signout, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/signup", signup); //working
router.post("/signin", signin);  //working
router.post("/signin/get-otp", sendSigninOTP); //working
router.post("/resend-otp", resendOTP);
router.post("/signout", signout);
// router.post("/google-signup", googleSignIn);


router.get("/", protect, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.name} to your dashboard` });
});

export default router;