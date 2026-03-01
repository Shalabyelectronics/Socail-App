import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import {
  getUserProfileService as getUserPublicProfileService,
  followUserService,
} from "../../services/userServices";
import { getUserProfileService } from "../../services/authServices";
import { Spinner, Card, CardHeader, Avatar, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Users } from "lucide-react";

export default function Followers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStatuses, setFollowingStatuses] = useState({});
  const { token, refreshUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Get current user's profile data which includes followers array
        const profileResponse = await getUserProfileService(token);
        const followersArray = profileResponse.data.data.user.followers || [];

        if (followersArray.length === 0) {
          setUsers([]);
          setIsLoading(false);
          return;
        }

        // Fetch each follower's profile data
        const invalidFollowerIds = [];
        const followerProfiles = await Promise.all(
          followersArray.map(async (followerId) => {
            try {
              const response = await getUserPublicProfileService(
                token,
                followerId,
              );
              return response.data.data.user;
            } catch (error) {
              // If follower not found (404), mark for cleanup
              if (error.response?.status === 404) {
                invalidFollowerIds.push(followerId);
              } else {
                console.error(`Failed to fetch follower ${followerId}:`, error);
              }
              return null;
            }
          }),
        );

        // Filter out any failed requests
        const validFollowers = followerProfiles.filter((user) => user !== null);
        setUsers(validFollowers);

        // Initialize following statuses from localStorage
        const followedUsers = JSON.parse(
          localStorage.getItem("followedUsers") || "{}",
        );
        const statuses = {};
        validFollowers.forEach((user) => {
          // Check if we're following them back
          statuses[user._id] = !!followedUsers[user._id];
        });
        setFollowingStatuses(statuses);
      } catch (error) {
        toast.error("Failed to load followers list");
        console.error("Error fetching followers:", error);
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
      }
      localStorage.setItem("followedUsers", JSON.stringify(followedUsers));

      // Refresh user profile to update following count
      refreshUserProfile?.();

      toast.success(
        newFollowStatus
          ? "Followed back successfully! 🎉"
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
        <Spinner label="Loading followers..." color="secondary" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Users size={64} className="text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          No Followers Yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          When people follow you, they'll appear here. Share interesting content
          to attract followers!
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
        Followers ({users.length})
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
                  className="ring-2 ring-secondary-500 ring-offset-2"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                color={followingStatuses[user._id] ? "default" : "primary"}
                variant={followingStatuses[user._id] ? "bordered" : "solid"}
                onPress={() => handleFollowClick(user._id)}
              >
                {followingStatuses[user._id] ? "Following" : "Follow Back"}
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
