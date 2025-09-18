import { useState } from 'react';
// import api from '../api';
import { useNavigate } from 'react-router-dom';
import SkincareForm from './SkincareForm';
import { ArrowLeft } from 'lucide-react';

const Fomcom = () => {
  const navigate = useNavigate();

  return (
     <div className="min-h-screen bg-teal-50 w-full bg-slate-100 flex flex-col items-center justify-center p-4 font-inter">
      <div className="text-center mb-8">
        <button
      onClick={() => navigate("/")}
      className="fixed top-6 left-6 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2 px-4 rounded-lg shadow hover:scale-105 transition-transform duration-300 z-50"
    >
      <ArrowLeft size={20} />
      <span className="font-semibold">Back</span>
    </button>
        <h1 className="text-4xl font-extrabold text-slate-800">Skincare Analysis</h1>
        <p className="text-slate-600 mt-2 text-lg">Answer a few questions to get your personalized routine.</p>
      </div>
      <SkincareForm />
    </div>
  );
};

export default Fomcom;
