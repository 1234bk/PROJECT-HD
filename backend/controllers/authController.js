// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail, sendWelcomeEmail } from "../utils/sendEmail.js";

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT token
const generateToken = (user, keepLoggedIn) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: keepLoggedIn ? "30d" : "1d",
  });
};

// -------------------- SIGNUP --------------------
// Send OTP for signup
export const signup = async (req, res) => {
  try {
    const { name, email, dateOfBirth } = req.body;
    if (!name || !email || !dateOfBirth)
      return res.status(400).json({ message: "All fields required" });

    let user = await User.findOne({ email });
    if (!user) user = new User({ name, email, dateOfBirth });

    // Generate OTP and save in DB
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.accountVerified = false;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- SIGNIN --------------------
// Send OTP for signin
export const sendSigninOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in generateOtp:", error.message);
  return res.status(500).json({ message: "Server error" });
}
};

// Verify OTP and login
export const signin = async (req, res) => {
  try {
    const { email, otp, keepLoggedIn } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpire < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.accountVerified = true;
    user.keepLoggedIn = !!keepLoggedIn;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = generateToken(user, user.keepLoggedIn);

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: user.keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    
    await sendWelcomeEmail(user.email, user.name);


    res.status(200).json({ message: "Logged in successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- RESEND OTP --------------------
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- GOOGLE SIGNIN --------------------
// export const googleSignIn = async (req, res) => {
//   try {
//     const { googleId, email, name, profilePicture } = req.body;
//     if (!googleId || !email)
//       return res.status(400).json({ message: "Google ID and email required" });

//     let user = await User.findOne({ email });
//     if (!user) {
//       user = new User({
//         name,
//         email,
//         googleId,
//         profilePicture,
//         authProvider: "google",
//         accountVerified: true,
//       });
//       await user.save();
//     }

//     const token = generateToken(user, true);
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     });

//     res.status(200).json({ message: "Logged in successfully", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
