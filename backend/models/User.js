// name--- dtaeofbirth----email---otp--keepme logged in--google sign in
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  otp: { type: String },
  otpExpire: { type: Date },
  keepLoggedIn: { type: Boolean, default: false },
  accountVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  authProvider: { type: String, enum: ["email", "google"], default: "email" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
