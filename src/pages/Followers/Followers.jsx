import React, { useContext } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

export default function Followers() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Users size={64} className="text-gray-400" />
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
        Followers Feature Coming Soon
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        The followers list feature requires API support. Once the backend
        provides a followers endpoint, you'll be able to see who follows you
        here!
      </p>
      <Button color="primary" onPress={() => navigate("/")}>
        Go to Feed
      </Button>
    </div>
  );
}
