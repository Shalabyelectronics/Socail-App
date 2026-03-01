import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import {
  getUserProfileService,
  followUserService,
} from "../../services/userServices";
import { Spinner, Card, CardHeader, Avatar, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Users } from "lucide-react";

export default function Following() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStatuses, setFollowingStatuses] = useState({});
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Read followedUsers from localStorage
        const followedUsers = JSON.parse(
          localStorage.getItem("followedUsers") || "{}",
        );
        const userIds = Object.keys(followedUsers);

        if (userIds.length === 0) {
          setUsers([]);
          setIsLoading(false);
          return;
        }

        // Fetch profile data for each followed user
        const invalidUserIds = [];
        const userProfiles = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const response = await getUserProfileService(token, userId);
              return response.data.data.user;
            } catch (error) {
              // If user not found (404), mark for removal from localStorage
              if (error.response?.status === 404) {
                invalidUserIds.push(userId);
              } else {
                console.error(`Failed to fetch user ${userId}:`, error);
              }
              return null;
            }
          }),
        );

        // Clean up localStorage by removing invalid user IDs
        if (invalidUserIds.length > 0) {
          const updatedFollowedUsers = { ...followedUsers };
          invalidUserIds.forEach((id) => delete updatedFollowedUsers[id]);
          localStorage.setItem(
            "followedUsers",
            JSON.stringify(updatedFollowedUsers),
          );
        }

        // Filter out any failed requests
        const validUsers = userProfiles.filter((user) => user !== null);
        setUsers(validUsers);

        // Initialize following statuses (all should be true)
        const statuses = {};
        validUsers.forEach((user) => {
          statuses[user._id] = true;
        });
        setFollowingStatuses(statuses);
      } catch (error) {
        toast.error("Failed to load following list");
        console.error("Error fetching following:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, [token]);

  const handleFollowClick = async (userId) => {
    try {
      const response = await followUserService(token, userId);
      const { following: newFollowStatus } = response.data.data;

      setFollowingStatuses((prev) => ({ ...prev, [userId]: newFollowStatus }));

      // Update localStorage
      const followedUsers = JSON.parse(
        localStorage.getItem("followedUsers") || "{}",
      );
      if (newFollowStatus) {
        followedUsers[userId] = true;
      } else {
        delete followedUsers[userId];
        // Remove from list if unfollowed
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId),
        );
      }
      localStorage.setItem("followedUsers", JSON.stringify(followedUsers));

      toast.success(
        newFollowStatus
          ? "Followed successfully! 🎉"
          : "Unfollowed successfully",
      );
    } catch (error) {
      console.error("Follow error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update follow status",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner label="Loading following..." color="secondary" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Users size={64} className="text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Not Following Anyone Yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Start following users to see them here. Discover interesting people in
          your feed!
        </p>
        <Button color="primary" onPress={() => navigate("/")}>
          Go to Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Following ({users.length})
      </h1>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <Card
            key={user._id}
            className="p-4 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex justify-between items-center p-0">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                onClick={() => navigate(`/users/${user._id}`)}
              >
                <Avatar
                  src={user.photo || "https://placehold.co/80x80?text=User"}
                  alt={user.name}
                  size="lg"
                  className="ring-2 ring-pink-500 ring-offset-2"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                  {user.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                color={followingStatuses[user._id] ? "default" : "primary"}
                variant={followingStatuses[user._id] ? "bordered" : "solid"}
                onPress={() => handleFollowClick(user._id)}
              >
                {followingStatuses[user._id] ? "Following" : "Follow"}
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
