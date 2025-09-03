import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import logo from './../assets/icon.png';
import img from './../assets/container.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


export default function Signin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Form states
  const [isVisible, setIsVisible] = useState(false);

  const [step, setStep] = useState(1); // 1 = get OTP, 2 = verify OTP
  const [form, setForm] = useState({
    otp: "",
    email: "",
    keepLoggedIn: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const toggleVisibility = () => setIsVisible(prev => !prev);
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
        keepLoggedIn: form.keepLoggedIn || false,
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

<div className="min-h-screen flex flex-col lg:flex-row font-inter">
  {/* Left: Form */}
 
  <div className="flex-1 flex lg:items-center items-start justify-center px-4 lg:px-16 pt-[55px]  lg:pt-0">
     
     {/* //desktop logo */}
 <div className="absolute top-4 left-4 hidden lg:flex items-center">
    <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
    <h2 className="ml-2 font-inter font-semibold text-2xl text-[#232323]">HD</h2>
  </div>

    <div className="w-full max-w-md  gap-4 p-5 lg:p-8">
      {/* Logo */}
      <div className=" lg:hidden flex justify-center mb-6">
        <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
        <h2 className="ml-2 font-inter font-semibold text-2xl text-center text-[#232323]">HD</h2>
      </div>

      <h1 className="text-center lg:text-left text-3xl lg:text-4xl font-bold mb-2">Sign in</h1>
      <p className="text-gray-500 text-center lg:text-left mb-6">Please login to continue to your account.</p>

      {/* Step 1 & Step 2 */}
      {step === 1 && (
        <>
          <fieldset className="rounded-lg flex items-center border border-[#a7a0a0] text-[#a7a0a0]   focus-within:border-blue-500 focus-within:text-blue-500 p-2 mb-4">
            <legend className="px-1 text-sm">Email</legend>
            <input
              type="email"
              name="email"
              placeholder=""
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent px-2 py-1 text-gray-900 outline-none"
            />
          </fieldset>

          <button
            onClick={handleGetOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="space-y-4">
            <fieldset className="rounded-lg border border-blue-500 flex items-center p-2">
              <legend className="px-1 text-sm text-blue-500">Email</legend>
              <input
                type="email"
                name="email"
                value={form.email}
                  readOnly
                onChange={handleChange}
                className="w-full bg-transparent px-2 py-1 text-gray-900 outline-none"
              />
            </fieldset>

            {/* OTP with toggle */}
            <div className="relative w-full   focus-within:border-blue-500">
              <input
                type={isVisible ? "text" : "password"}
                name="otp"
                placeholder="OTP"
                value={form.otp}
                onChange={handleChange}
                className="w-full focus-within:border-blue-500 border border-[#a7a0a0] text-[#a7a0a0]  rounded-lg p-3 pr-10 text-gray-900 outline-none"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {isVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <h1 onClick={handleGetOtp} className="text-start cursor-pointer text-sm underline font-semibold text-[#367AFF] cursor-pointer">
              Resend OTP
            </h1>

            {/* Keep logged in toggle */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                setForm((prev) => ({ ...prev, keepLoggedIn: !prev.keepLoggedIn }))
              }
            >
              <div
                className={`w-5 h-5 border rounded-sm flex items-center justify-center mr-2
                  ${form.keepLoggedIn ? "bg-blue-600 border-blue-600" : "bg-white border-2 border-black"}`}
              >
                {form.keepLoggedIn && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-black select-none">Keep me logged in</span>
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#367AFF] text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </>
      )}

      {/* {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>} */}

      <p className="text-center text-gray-600  text-sm mt-6">
        Need an account?{" "}
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => navigate("/signup")}
        >
          Create one
        </span>
      </p>
    </div>
  </div>

  {/* Right: Image */}
  <div className="hidden h-screen  lg:flex flex-[2] p-[12px]">
  <div className="w-full rounded-lg overflow-hidden">
    <img
      src={img} // replace with your imported image
      alt="Side Illustration"
      className="w-full  object-cover"
    />
  </div>
</div>
</div>


  );
}
