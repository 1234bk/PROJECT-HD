import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";
import { FaDownload, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 50 },
  }),
};

const listItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const Card = ({ title, children, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
  >
    <h3 className="text-2xl font-semibold mb-5 text-teal-600 flex items-center gap-3">
      <FaCheckCircle className="text-teal-400" /> {title}
    </h3>
    <div className="text-gray-700 text-base leading-relaxed">{children}</div>
  </motion.div>
);

const ResultPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const reportRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get("/skinanalysis/result");
        if (res.data.success) setAnalysis(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setPdfLoading(true);
    setDownloadSuccess(false);

    try {
      const opt = {
        margin: 0.5,
        filename: "skin-analysis.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(reportRef.current).save();

      setDownloadSuccess(true);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to create PDF. Please try again.");
    } finally {
      setPdfLoading(false);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <div className="loader mb-4" />
          <p className="text-teal-700 text-lg font-medium">Loading your analysis…</p>
        </div>
      </div>
    );

  if (!analysis)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <p className="text-teal-600 text-lg font-semibold">
          No analysis found. Please run the skin analysis first.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white p-8 flex justify-center">
       
       <button
            onClick={() => navigate("/")}
            className="fixed top-6 left-6 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2 px-4 rounded-lg shadow hover:scale-105 transition-transform duration-300 z-50"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back</span>
          </button>
      <div className="max-w-5xl   mt-12 md:mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6"
        >
          <div>
            <h1 className="md:text-4xl mt-3 text-2xl text-center font-extrabold text-teal-700 mb-1">
              Your Skin Analysis
            </h1>
            <p className="text-teal-500 md:text-lg text-sm ">
              Personalized routine & recommendations
            </p>
          </div>

          <div>
            <button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="hidden"
              // className="  inline-flex items-center gap-2 md:gap-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-3 px-6 rounded-full shadow-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
              aria-label="Download skin analysis report as PDF"
            >
              {pdfLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Preparing PDF...
                </>
              ) : downloadSuccess ? (
                "Downloaded!"
              ) : (
                <>
                  <FaDownload /> Download PDF
                </>
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            ref={reportRef}
            id="report"
            className="md:space-y-10  space-y-5 bg-teal md:p-10  "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card title="Skin Type & Reasoning" index={0}>
              
              <h2 className="md:text-2xl text-lg font-semibold text-teal-700">
                {analysis.skinType}
              </h2>
              <p className="mt-3 text-sm md:text-lg whitespace-pre-wrap">{analysis.skinTypeReasoning}</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-10">
              <Card title="Diet Suggestions" index={1}>
                <div className="grid grid-cols-2 md:gap-6 ">
                  <div>
                    <h4 className="font-semibold pl-2 text-teal-600">Eat</h4>
                    <motion.ul
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="list-disc text-sm md:text-lg md:pl-6  mt-3 text-gray-700"
                    >
                      {analysis.dietSuggestions?.eat?.map((item, idx) => (
                        <motion.li
                          key={idx}
                          variants={listItemVariants}
                          className="mb-1"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-600 pl-5">Avoid</h4>
                    <motion.ul
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="list-disc text-sm md:text-lg md:pl-6 pl-3 mt-3 text-gray-700"
                    >
                      {analysis.dietSuggestions?.avoid?.map((item, idx) => (
                        <motion.li
                          key={idx}
                          variants={listItemVariants}
                          className="mb-1"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </Card>

              <Card title="Dos & Don'ts" index={2}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-teal-600">Dos</h4>
                    <motion.ul
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="list-disc  text-sm md:text-lg md:pl-6  mt-3 text-gray-700"
                    >
                      {analysis.dosAndDonts?.dos?.map((item, idx) => (
                        <motion.li
                          key={idx}
                          variants={listItemVariants}
                          className="mb-1"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-600">Don'ts</h4>
                    <motion.ul
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="list-disc  text-sm md:text-lg md:pl-6  mt-3 text-gray-700"
                    >
                      {analysis.dosAndDonts?.donts?.map((item, idx) => (
                        <motion.li
                          key={idx}
                          variants={listItemVariants}
                          className="mb-1"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Routine Schedule" index={3}>
              <div className="grid md:grid-cols-3 md:gap-8 gap-4">
                {["morning", "night", "weekly"].map((time, idx) => (
                  <div key={time}>
                    <h4 className="font-semibold text-teal-600 capitalize">{time}</h4>
                    <motion.ol
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                      }}
                      className="list-decimal md:pl-6 text-sm md:text-lg md:mt-3 text-gray-700"
                    >
                      {analysis.routineSchedule?.[time]?.map((item, i) => (
                        <motion.li key={i} variants={listItemVariants} className="mb-1">
                          {item}
                        </motion.li>
                      ))}
                    </motion.ol>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Recommended Products" index={4}>
              <div className="grid md:grid-cols-2 md:gap-6 gap-4">
                {analysis.recommendedProducts?.map((p, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)" }}
                    className="md:p-6 p-3 text-sm md:text-lg border rounded-2xl bg-teal-50 border-teal-200 cursor-pointer transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-teal-700">{p.name}</h4>
                      <span className="hidden md:block text-sm text-teal-500">{p.priceRange}</span>
                    </div>
                    <p className="mt-3 text-teal-800">{p.reason}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card title="Additional Remarks" index={5}>
              <p className="whitespace-pre-wrap text-sm md:text-lg text-gray-700">{analysis.additionalRemarks}</p>
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className=" hidden text-center text-sm text-teal-400 mt-8 select-none">
          Tip: Use the "Download PDF" button to save a copy for later.
        </p>
      </div>
    </div>
  );
};

export default ResultPage;