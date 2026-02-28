import React, { useEffect, useState, createContext } from "react";
import { getUserProfileService } from "../../services/authServices";

export const AuthContext = createContext();
export default function AuthContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("userToken"));
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfileService(token);

        setUser(response.data.data.user);
        setUserPhoto(response.data.data.user.photo);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (token) {
      localStorage.setItem("userToken", token);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [token, isAuthReady]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, userPhoto, setUserPhoto, isAuthReady }}
    >
      {children}
    </AuthContext.Provider>
  );
}
