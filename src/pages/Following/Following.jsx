import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import {
  getUserProfileService as getUserPublicProfileService,
  followUserService,
} from "../../services/userServices";
import { getUserProfileService } from "../../services/authServices";
import { Spinner, Card, CardHeader, Avatar, Button } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Users, ArrowLeft } from "lucide-react";

export default function Following() {
  const { userId } = useParams(); // Get userId from URL params
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStatuses, setFollowingStatuses] = useState({});
  const [targetUserName, setTargetUserName] = useState("");
  const {
    token,
    user: currentUser,
    refreshUserProfile,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determine if viewing own profile or another user's
  const isOwnProfile =
    !userId || userId === currentUser?.id || userId === currentUser?._id;

  useEffect(() => {
    const getUsers = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let followingArray = [];
        let targetUser = null;

        if (isOwnProfile) {
          // Get current user's profile data which includes following array
          const profileResponse = await getUserProfileService(token);
          followingArray = profileResponse.data.data.user.following || [];
          setTargetUserName("You"); // Display "You" for own profile
        } else {
          // Get specified user's profile data
          const profileResponse = await getUserPublicProfileService(
            token,
            userId,
          );
          targetUser =
            profileResponse.data.data.user || profileResponse.data.data;
          followingArray = targetUser.following || [];
          setTargetUserName(targetUser.name); // Display the user's name
        }

        if (followingArray.length === 0) {
          setUsers([]);
          setIsLoading(false);
          return;
        }

        // Fetch each followed user's profile data
        const invalidUserIds = [];
        const userProfiles = await Promise.all(
          followingArray.map(async (followUserItem) => {
            // Extract ID whether it's an object or a string
            const followUserId =
              typeof followUserItem === "object"
                ? followUserItem._id || followUserItem.id
                : followUserItem;

            try {
              const response = await getUserPublicProfileService(
                token,
                followUserId,
              );
              return response.data.data.user;
            } catch (error) {
              // If user not found (404), mark for cleanup
              if (error.response?.status === 404) {
                invalidUserIds.push(followUserId);
              } else {
                console.error(`Failed to fetch user ${followUserId}:`, error);
              }
              return null;
            }
          }),
        );

        // Filter out any failed requests
        const validUsers = userProfiles.filter((user) => user !== null);
        setUsers(validUsers);

        // Initialize following statuses
        // If viewing own profile, all should be true (we're following them)
        // If viewing another user's profile, check if we're following each user
        const statuses = {};
        if (isOwnProfile) {
          validUsers.forEach((user) => {
            statuses[user._id] = true;
          });
        } else {
          // Check localStorage to see who we're following
          const followedUsers = JSON.parse(
            localStorage.getItem("followedUsers") || "{}",
          );
          validUsers.forEach((user) => {
            statuses[user._id] = !!followedUsers[user._id];
          });
        }
        setFollowingStatuses(statuses);
      } catch (error) {
        toast.error("Failed to load following list");
        console.error("Error fetching following:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, [token, userId, isOwnProfile]);

  const handleFollowClick = async (userIdToFollow) => {
    try {
      const response = await followUserService(token, userIdToFollow);
      const { following: newFollowStatus } = response.data.data;

      setFollowingStatuses((prev) => ({
        ...prev,
        [userIdToFollow]: newFollowStatus,
      }));

      // Update localStorage
      const followedUsers = JSON.parse(
        localStorage.getItem("followedUsers") || "{}",
      );
      if (newFollowStatus) {
        followedUsers[userIdToFollow] = true;
      } else {
        delete followedUsers[userIdToFollow];
        // Only remove from list if viewing own profile and unfollowing
        if (isOwnProfile) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userIdToFollow),
          );
        }
      }
      localStorage.setItem("followedUsers", JSON.stringify(followedUsers));

      // Refresh user profile to update following count
      refreshUserProfile?.();

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

  const handleBack = () => {
    if (userId) {
      navigate(`/users/${userId}`);
    } else {
      navigate(-1);
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
    <div className="max-w-2xl mx-auto p-4">
      {/* Back Button */}
      <Button
        startContent={<ArrowLeft size={18} />}
        variant="light"
        onPress={handleBack}
        className="mb-4"
      >
        Back to Profile
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {targetUserName === "You"
          ? "People You Follow"
          : `${targetUserName}'s Following`}{" "}
        ({users.length})
      </h1>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <Card
            key={user._id}
            className="p-4 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex justify-between items-center p-0">
              <div className="flex items-center gap-3 flex-1">
                <Avatar
                  src={user.photo || "https://placehold.co/80x80?text=User"}
                  alt={user.name}
                  size="lg"
                  className="ring-2 ring-pink-500 ring-offset-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/users/${user._id}`)}
                />
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity flex-1"
                  onClick={() => navigate(`/users/${user._id}`)}
                >
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
