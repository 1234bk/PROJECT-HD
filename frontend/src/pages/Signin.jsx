import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import logo from './../assets/icon.png';


export default function Signin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Form states
  const [step, setStep] = useState(1); // 1 = get OTP, 2 = verify OTP
  const [form, setForm] = useState({
    name: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Get OTP
  const handleGetOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/resend-otp", {
    
        email: form.email,

        // name, email, dateOfBirth
      });
      setMessage(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP (Sign in)
  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", {
        email: form.email,
        otp: form.otp,
      });
      setUser(res.data.user);
      console.log("user at signup page after verifying otp" ,res.data.user); // store user in context
      navigate("/"); // redirect to home
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">

      <div className="w-full max-w-md  gap-[10PX] p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
          <h2 className="ml-[10px] font-inter font-semibold text-[24px] leading-[110%] tracking-[-0.04em] text-center text-[#232323]">HD</h2>
        </div>

        
        <p className="text-gray-500 text-center mb-6">
          Sign up to enjoy the feature of HD
        </p>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
           
            <div className="space-y-4">
             
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <button
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            <div className="space-y-4">
              
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />

              <input
                type="text"
                name="otp"
                placeholder="OTP"
                value={form.otp}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Verifying..." : "Sign up"}
            </button>
          </>
        )}

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
