import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, User, LogOut, RefreshCw, FileText } from 'lucide-react';
import logo from './../assets/logomain.png';
import { useAuth } from "../contexts/AuthContext";
import userAvatar from './../assets/avatar.webp'; // Assuming this is the user's avatar
import graphic from './../assets/good.png'; // Assuming this is the user's avatar
import api, { setAuthToken } from '../api/axios';

const Home = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user   } = useAuth(); // Removed setUser as it wasn't used
   const [analysisData, setAnalysisData] = useState(null);
  const handleSignOut = () => {
     const userConfirmed = confirm("Do you really want to sign out?");
    if (userConfirmed) {
      localStorage.removeItem("token");
      setAuthToken(null);
    setShowUserMenu(false); // Close menu on navigation
    navigate('/signin');
    } 
    
    
  };

  useEffect(() => {
   const checkresult = async () => {
    
    try {
      const response = await api.get("/skinanalysis/check");
      
      setAnalysisData(response.data.data || null);
      console.log("working skinannalysis/check function");
      
    } catch (err) {
      console.error("yha dikkat hai Failed to get analysis:", err);
    }

    
  };
  checkresult();
  }, []);

  

  return (

 <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white font-inter text-slate-800 flex flex-col">

      {/* Navbar */}
      <nav className="bg-gradient-to-br from-teal-50 to-white backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">SkinEdu</h1>
          </div>

          <div className="relative">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-offset-2 ring-cyan-500/50 hover:ring-cyan-500 transition-all"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />

            <div className={`absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform ${showUserMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="px-4 py-3">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="font-semibold truncate">{user?.name || 'User'}</p>
              </div>
              <div className="border-t border-slate-200"></div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-slate-100 transition-colors"
              >
                <LogOut size={18} className="text-slate-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-start md:items-center justify-center px-2 py-10">
        <div className="flex flex-col-reverse md:flex-row items-center pt-14 md:pt-0 w-full  space-y-10 md:space-y-0 md:space-x-10">

          {/* Text Content */}
          <div className="md:min-w-[40%] space-y-6 text-left p-5 md:p-0 md:pl-12">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900">
              Hello,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : 'Guest'}
              </span>
            </h1>

            <p className="md:text-xl  text-slate-600 max-w-xl">
              Welcome to your personalized skincare journey. Get tailored advice, insights, and recommendations designed for your unique skin needs.
            </p>

            {!analysisData ? (
        // If no analysis → single button
          // <div className='p-1 mx-auto bg-gradient-to-r from-cyan-600 to-teal-500  rounded-full shadow-lg hover:shadow-xl  transform hover:-translate-y-1 transition-transform duration-300' >
        
        <button
          onClick={() => navigate("/form")}
          className="group border-2  border-white inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white md:py-3 py-3 md:px-6 px-3 rounded-full shadow-xl hover:shadow-xl transform hover:-translate-y-1 animate-pulse transition-transform duration-300"
        >
          <span className="font-semibold md:text-lg">Start Your Skin Assessment</span>
          <ArrowRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            size={20}
          />
        </button>
        // </div>
      ) : (
        // If analysis exists → show 2 buttons
        <div className="flex flex-col sm:flex-row gap-5   md:pt-0">
          <div className='p-1 mx-auto bg-gradient-to-r from-cyan-600 to-teal-500  rounded-full shadow-lg hover:shadow-xl  transform hover:-translate-y-1 transition-transform duration-300' >
          <button
            onClick={() => navigate("/result")}
            className="group border-2 border-white inline-flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white md:py-3 py-2 md:px-6 px-3 rounded-full shadow-xl hover:shadow-xl transform "
          >
            <FileText className="transition-transform duration-300 group-hover:rotate-6" size={20} />
            <span className="font-semibold md:text-lg">View My Results</span>
          </button>
          </div>
         <div className='p-1 mx-auto bg-gradient-to-r from-teal-500 to-cyan-600  rounded-full shadow-lg hover:shadow-xl  transform hover:-translate-y-1 transition-transform duration-300' >
         
          <button
            onClick={() => navigate("/form")}
            className="group border-2 border-white inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-teal-500 text-white md:py-3 py-2 md:px-6 px-3 rounded-full shadow-xl hover:shadow-xl transform "
          >
            <RefreshCw className="transition-transform duration-300 group-hover:rotate-180" size={20} />
            <span className="font-semibold md:text-lg">Do a New Analysis</span>
          </button>
           </div>
        </div>
      )}
          </div>

          {/* Image Content */}
          <div className="">
            <img 
              src={graphic} 
              alt="Skincare illustration" 
              className="w-[100%] h-[100%] hidden md:block  mx-auto rounded-lg"
            />
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full p-4 shadow-2xl flex items-center gap-3 animate-bounce hover:scale-110 transition-transform duration-300 min-w-[220px]"
      >
        <MessageCircle size={24} />
        <span className="font-semibold">Ask me anything</span>
      </button>
    </div>
    
  );
};

export default Home;