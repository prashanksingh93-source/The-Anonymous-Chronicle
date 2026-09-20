import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsValid(true);
      } catch (error) {
        localStorage.removeItem("adminToken");
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;