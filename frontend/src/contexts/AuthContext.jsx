import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Check login status on app load
  useEffect(() => {
     const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); // backend route
        setUser(res.data.user);
        console.log("response from getMe at auth page", res.data.user);
        setLoading(false);
    
      } catch (err) {
        console.error("Error fetching user:", err);
          //  navigate("/signin");
        setUser(null); // reset if not logged in
        
      }finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
