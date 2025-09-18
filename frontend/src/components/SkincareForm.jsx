import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "./question.js";
import api from "../api/axios.js";

const SkincareForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // Enhanced handler for all question types
  const handleAnswerChange = (questionId, value, type) => {
    if (type === "multiselect") {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter((item) => item !== value)
        : [...currentAnswers, value];
      setAnswers((prev) => ({ ...prev, [questionId]: newAnswers }));
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Final Answers Payload:", answers);
    // TODO: Send 'answers' to your backend API
    try {
      const response = await api.post("/skinanalysis", answers);
      const analysisData = response.data.data;

      console.log("Detailed Skin Analysis:", analysisData);
      
    } catch (err) {
      console.error("Failed to get analysis:", err);
    }

    // Simulating API call for now
    setTimeout(() => {
      setLoading(false);
      // alert("Analysis Complete! Redirecting to your results...");
      // navigate('/results/mock-id');
      navigate(`/result`);
    }, 500);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Validation check for the "Next" button
  const isAnswered =
    answers[currentQuestion.id] &&
    (Array.isArray(answers[currentQuestion.id])
      ? answers[currentQuestion.id].length > 0
      : String(answers[currentQuestion.id]).trim() !== "");

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
        <motion.div
          className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="mb-8 min-h-[90px]">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              {currentQuestion.text}
            </h2>
            {currentQuestion.subtext && (
              <p className="text-slate-500 mt-2">{currentQuestion.subtext}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* MCQ Renderer */}
            {currentQuestion.type === "mcq" &&
              currentQuestion.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id] === option.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={answers[currentQuestion.id] === option.value}
                    className="hidden"
                    onChange={(e) =>
                      handleAnswerChange(
                        currentQuestion.id,
                        e.target.value,
                        "mcq"
                      )
                    }
                  />
                  <span className="font-medium text-slate-700">
                    {option.label}
                  </span>
                </label>
              ))}

            {/* Multiselect Renderer */}
            {currentQuestion.type === "multiselect" &&
              currentQuestion.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id]?.includes(option.value)
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={
                      answers[currentQuestion.id]?.includes(option.value) ||
                      false
                    }
                    className="hidden"
                    onChange={(e) =>
                      handleAnswerChange(
                        currentQuestion.id,
                        e.target.value,
                        "multiselect"
                      )
                    }
                  />
                  <div
                    className={`w-6 h-6 border-2 rounded-md mr-4 flex items-center justify-center transition-all ${
                      answers[currentQuestion.id]?.includes(option.value)
                        ? "bg-teal-500 border-teal-500"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[currentQuestion.id]?.includes(option.value) && (
                      <Check size={18} className="text-white" />
                    )}
                  </div>
                  <span className="font-medium text-slate-700">
                    {option.label}
                  </span>
                </label>
              ))}

            {/* Dropdown Renderer */}
            {currentQuestion.type === "dropdown" && (
              <select
                onChange={(e) =>
                  handleAnswerChange(
                    currentQuestion.id,
                    e.target.value,
                    "dropdown"
                  )
                }
                value={answers[currentQuestion.id] || ""}
                className="w-full text-lg p-4 border-2 border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" disabled>
                  Select an option...
                </option>
                {currentQuestion.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {/* Text Input Renderer */}
            {currentQuestion.type === "text" && (
              <input
                type="text"
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.id, e.target.value, "text")
                }
                value={answers[currentQuestion.id] || ""}
                placeholder="Type your answer here..."
                className="w-full text-lg p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-slate-600 font-semibold py-2 px-4 rounded-full hover:bg-slate-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {currentStep < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="group inline-flex items-center gap-2 bg-teal-500 text-white py-3 px-6 rounded-full font-semibold shadow-lg hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !isAnswered}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing Your Skin..." : "Get My Routine"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SkincareForm;
