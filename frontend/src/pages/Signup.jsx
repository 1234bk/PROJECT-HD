import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import logo from './../assets/logomain.png';
import img from './../assets/graphic.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineCalendar } from "react-icons/ai";
import { format } from "date-fns";




export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Form states
   const [isVisible, setIsVisible] = useState(false);

  const [step, setStep] = useState(1); // 1 = get OTP, 2 = verify OTP
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
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
      const res = await api.post("/auth/signup", {
        name: form.name,
  dateOfBirth: form.dob ? form.dob.toISOString() : "",
  email: form.email,

        // name, email, dateOfBirth
      });
      setMessage(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      window.alert(err.response?.data?.message || "Something went wrong");
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", {
        email: form.email,
        otp: form.otp,
        keepLoggedIn: form.keepLoggedIn || false,
      });
      const token = res.data.token;       // get token from backend
    localStorage.setItem("token", token); // save token locally
    setAuthToken(token);                 // attach token to future requests
      setLoading(false);
    setUser(res.data.user);              // save user in context
    console.log("user at signup page after verifying otp", res.data.user);
    navigate("/"); 
    } catch (err) {
      window.alert(err.response?.data?.message || "Something went wrong");
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  return (
    

<div className="min-h-screen bg-teal-50 flex flex-col lg:flex-row font-inter">


  {/* Left: Form */}
 
  <div className="flex-1 flex lg:items-center items-start justify-center px-4 lg:px-16 pt-[55px]  lg:pt-0">
     
     {/* //desktop logo */}
 <div className="absolute top-4 left-4 hidden lg:flex items-center">
    <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
    <h2 className="ml-2 font-inter font-semibold text-2xl text-bold text-[#232323]">SkinEdu</h2>
  </div>

    <div className="w-full max-w-md  gap-4 p-5 lg:p-8">
      {/* Logo */}
      <div className=" lg:hidden flex justify-center mb-6">
        <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
        <h2 className="ml-2 font-inter font-semibold text-2xl text-center text-[#232323]">SkinEdu</h2>
      </div>

      <h1 className="text-center lg:text-left text-3xl lg:text-4xl font-bold mb-2">Sign up</h1>
      <p className="text-gray-500 text-center lg:text-left mb-6">Sign up to enjoy the feature of HD</p>

      {/* Step 1 & Step 2 */}
     
          
        {step === 1 && (
          <>
           
            <div className="space-y-4">
             
               <fieldset className="rounded-lg text-[#a7a0a0] border border-[#a7a0a0]  focus-within:border-teal-500 focus-within:text-teal-500 flex items-center p-2">
              <legend className="px-1 text-sm ">Your Name</legend>
              <input
                 type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent px-2 py-1 text-gray-900 outline-none"
              />
            </fieldset>

              
              
            <fieldset className="rounded-lg border text-[#a7a0a0] border-[#a7a0a0] focus-within:border-teal-500 focus-within:text-teal-500 flex items-center p-2 relative">
  <legend className="px-1 text-sm">Date of Birth</legend>

  {/* Calendar icon */}
  <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

  {/* DatePicker input */}
  <DatePicker
   selected={form.dob ? new Date(form.dob) : null}
    onChange={(date) => setForm({ ...form, dob: date })}
    scrollableYearDropdown
    showYearDropdown
    yearDropdownItemNumber={100}
    maxDate={new Date()}
    placeholderText="Select birthdate"

    className="w-full pl-10 bg-transparent py-1 text-gray-900 outline-none"
    dateFormat="dd MMMM yyyy" // 15 November 2017
  />
</fieldset>
              
              
           
             <fieldset className="rounded-lg text-[#a7a0a0] border border-[#a7a0a0]  focus-within:border-teal-500 focus-within:text-teal-500 flex items-center p-2">
              <legend className="px-1 text-sm ">Email</legend>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-transparent px-2 py-1 text-gray-900 outline-none"
              />
            </fieldset>
 </div>
            <button
              onClick={handleGetOtp}
              disabled={loading}
              className = {`w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 rounded-lg mt-6 hover:bg-teal-700 disabled:bg-teal-300 ${loading ? "opacity-50 cursor-not-allowed" : ""} `}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </>
        )}
            {step === 2 && (
          <>
             <div className="space-y-4">
             
               <fieldset className="rounded-lg  border border-teal-500 text-[#a7a0a0] flex items-center p-2">
              <legend className="px-1 text-teal-500 text-sm ">Your Name</legend>
              <input
                 type="text"
                name="name"
                  readOnly
                placeholder="Your Name"
                value={form.name}
                className="w-full bg-transparent px-2 py-1 text-gray-900 outline-none"
              />
            </fieldset>

              
                <fieldset className="rounded-lg border-teal-500 border  focus-within:border-teal-500 focus-within:text-teal-500 flex items-center p-2 relative">
  <legend className="px-1 text-teal-500 text-sm">Date of Birth</legend>

  {/* Calendar icon */}
  <AiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />

  {/* DatePicker input */}
  <DatePicker
    selected={form.dob ? new Date(form.dob) : null}
     readOnly
    placeholderText="Select birthdate"
    className="w-full pl-10 bg-transparent py-1 text-gray-900 outline-none"
    dateFormat="dd MMMM yyyy" // 15 November 2017
  />
</fieldset>
              
              
           
             <fieldset className="rounded-lg  border border-teal-500 text-[#a7a0a0] flex items-center p-2">
              <legend className="px-1 text-sm text-teal-500 ">Email</legend>
              <input
                type="email"
                name="email"
                  readOnly
                value={form.email}
                className="w-full bg-transparent px-2 py-1 text-gray-900 outline-none"
              />
            </fieldset>


<div className="relative w-full   focus-within:border-teal-500">
              <input
                type={isVisible ? "text" : "password"}
                name="otp"
                placeholder="OTP"
                value={form.otp}
                onChange={handleChange}
                className="w-full focus-within:border-teal-500 border border-[#a7a0a0] text-[#a7a0a0]  rounded-lg p-3 pr-10 text-gray-900 outline-none"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {isVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
             {/* <div className="relative w-full focus-within:border-teal-500">
              <input
                type={isVisible ? "text" : "password"}
                name="otp"
                placeholder="OTP"
                value={form.otp}
                 pattern="\d*" 
                onChange={handleChange}
                className="w-full focus-within:border-teal-500 border rounded-lg p-3 pr-10 text-gray-900 outline-none"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {isVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div> */}
 </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full bg-teal-600 text-white py-3 rounded-lg mt-6 hover:bg-teal-700 disabled:bg-teal-300 disabled:bg-teal-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Verifying..." : "Sign up"}
            </button>
          </>
        )}

      {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}

      <p  onClick={() => navigate("/signin")} className="text-center text-gray-600   text-sm mt-6">
        Already have an account??{" "}
        <span
          className="text-teal-600 cursor-pointer underline"
          onClick={() => navigate("/signin")}
        >
          Sign in
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
