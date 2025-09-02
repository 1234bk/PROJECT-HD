import express from 'express';
import {   getMe, resendOTP, sendSigninOTP, signin, signout, signup } from '../controllers/authController.js';

const router = express.Router();


router.get("/me", getMe);
router.post("/signup", signup); //working
router.post("/signin", signin);  //working
router.post("/signin/get-otp", sendSigninOTP); //working
router.post("/resend-otp", resendOTP);
router.post("/signout", signout);
// router.post("/google-signup", googleSignIn);




export default router;