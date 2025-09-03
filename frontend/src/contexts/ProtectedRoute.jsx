import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);        // save user in context
        setIsAuthenticated(true);      // user is authenticated
      } catch (err) {
        console.log("Not authenticated");
        setIsAuthenticated(false);     // redirect to signin
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (loading) return <div>Loading...</div>; // show loading while checking

  return isAuthenticated ? children : <Navigate to="/signin" />;
}
