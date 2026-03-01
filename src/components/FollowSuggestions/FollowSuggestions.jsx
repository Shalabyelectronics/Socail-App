import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Divider,
  Spinner,
} from "@heroui/react";
import { Users } from "lucide-react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import {
  getFollowSuggestionsService,
  followUserService,
} from "../../services/userServices";
import { toast } from "react-toastify";

export default function FollowSuggestions({ onFollowSuccess }) {
  const { token } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});
  const [followLoadingMap, setFollowLoadingMap] = useState({});

  // Fetch suggestions on mount
  useEffect(() => {
    if (!token) return;

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await getFollowSuggestionsService(token, 1, 5);
        const data = response.data.data || [];

        // Ensure it's an array
        const suggestionsArray = Array.isArray(data) ? data : [];
        setSuggestions(suggestionsArray);

        // Initialize following map (assume all are not being followed)
        const followMap = {};
        suggestionsArray.forEach((user) => {
          followMap[user._id] = false;
        });
        setFollowingMap(followMap);
      } catch (error) {
        console.error("Failed to fetch follow suggestions:", error);
        toast.error("Failed to load suggestions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [token]);

  const handleFollowClick = async (userId) => {
    if (followLoadingMap[userId]) return;

    setFollowLoadingMap((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await followUserService(token, userId);
      const { following } = response.data.data;

      // Update following state
      setFollowingMap((prev) => ({ ...prev, [userId]: following }));

      // Show success toast
      toast.success(
        following
          ? "User followed successfully! 🎉"
          : "User unfollowed successfully",
      );

      // Call parent callback to refresh if needed
      onFollowSuccess?.();
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error(error.response?.data?.message || "Failed to follow user");
    } finally {
      setFollowLoadingMap((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-md rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
        <CardBody className="flex justify-center items-center py-8">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-500 mt-2">Loading suggestions...</p>
        </CardBody>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="w-full shadow-md rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
        <CardBody className="py-8 text-center">
          <Users size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No suggestions available right now</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
      <CardHeader className="flex gap-3 px-5 pt-5 pb-3">
        <Users size={20} className="text-[#5E17EB]" />
        <div className="flex flex-col">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Follow Suggestions
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            People you may know
          </p>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="px-4 py-4">
        <div className="flex flex-col gap-3">
          {suggestions.map((user, index) => (
            <div key={user._id}>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar
                    src={user.photo || "https://via.placeholder.com/40"}
                    alt={user.name}
                    size="md"
                    className="ring-2 ring-[#5E17EB] ring-offset-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{user.username || "username"}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className={
                    followingMap[user._id]
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "bg-[#5E17EB] text-white hover:bg-[#4a12ba]"
                  }
                  onClick={() => handleFollowClick(user._id)}
                  disabled={followLoadingMap[user._id]}
                  aria-busy={followLoadingMap[user._id]}
                >
                  {followLoadingMap[user._id] ? (
                    <Spinner size="sm" color="white" />
                  ) : followingMap[user._id] ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              </div>

              {index !== suggestions.length - 1 && <Divider className="my-1" />}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
