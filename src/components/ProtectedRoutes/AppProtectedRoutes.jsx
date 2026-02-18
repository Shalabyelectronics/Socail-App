import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../AuthContext/AuthContextProvider";

export default function AppProtectedRoutes({ children }) {
  const { token, isAuthReady } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthReady) return;
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, isAuthReady, navigate]);

  if (!isAuthReady) return null;
  return children;
}
