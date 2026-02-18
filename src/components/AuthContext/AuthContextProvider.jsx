import React, { useEffect, useState, createContext } from "react";
export const AuthContext = createContext();
export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("userToken"));
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    if (token) {
      localStorage.setItem("userToken", token);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [token, isAuthReady]);
  return (
    <AuthContext.Provider value={{ token, setToken, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}
