import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Divider,
  Spinner,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Mail, Calendar, User, ImagePlus } from "lucide-react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import PostCard from "../../components/PostCard/PostCard";
import NoPosts from "../../components/NoPosts/NoPosts";
import { getUserPostsService } from "../../services/postServices";
import { getUserProfileService } from "../../services/authServices";
import UpdateCoverPhoto from "../../components/UpdateCoverPhoto/UpdateCoverPhoto";
import { toast } from "react-toastify";

export default function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isCoverEditOpen, setIsCoverEditOpen] = useState(false);
  const {
    token,
    user: currentUser,
    refreshUserProfile,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!token) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      const response = await getUserProfileService(token);
      const profileData = response.data.data?.user || response.data.data;
      setUserProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user posts
  const refreshUserPosts = async () => {
    // Don't fetch if no token (user not logged in yet)
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getUserPostsService(token);
      setPosts(response.data.data.posts);
    } catch (error) {
      // Don't log 401 errors (user will be redirected to login)
      if (error.response?.status !== 401) {
        console.error(
          error.response?.data?.message || "Error fetching user posts",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    refreshUserPosts();
  }, [token]);

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" className="text-[#5E17EB]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      {/* Cover Photo Banner */}
      <div className="relative w-full mb-10 rounded-xl overflow-hidden group">
        <img
          src={
            userProfile?.cover ||
            currentUser?.cover ||
            "https://placehold.co/1200x300/5E17EB/FFFFFF?text=Cover+Photo"
          }
          alt="Cover photo"
          className="w-full h-48 object-cover"
        />

        {/* Edit Icon Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            isIconOnly
            className="bg-white/90 hover:bg-white text-[#5E17EB] rounded-full"
            onPress={() => setIsCoverEditOpen(true)}
            startContent={<ImagePlus size={24} />}
          />
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="w-full shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 mb-6 -mt-20">
        <CardBody className="py-6 px-5">
          <div className="flex gap-4 items-start">
            {/* Avatar */}
            <Avatar
              src={
                userProfile?.photo ||
                currentUser?.photo ||
                "https://via.placeholder.com/120"
              }
              alt={userProfile?.name || currentUser?.name}
              className="w-32 h-32 text-large ring-4 ring-white dark:ring-gray-800"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userProfile?.name || currentUser?.name || "User"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    @
                    {userProfile?.username ||
                      currentUser?.username ||
                      "username"}
                  </p>
                </div>
              </div>

              {/* User Details */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {/* Email */}
                {(userProfile?.email || currentUser?.email) && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#5E17EB]" />
                    <a
                      href={`mailto:${userProfile?.email || currentUser?.email}`}
                      className="text-[#5E17EB] hover:underline"
                    >
                      {userProfile?.email || currentUser?.email}
                    </a>
                  </div>
                )}

                {/* Date of Birth */}
                {(userProfile?.dateOfBirth || currentUser?.dateOfBirth) && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#5E17EB]" />
                    <span>
                      Born:{" "}
                      {new Date(
                        userProfile?.dateOfBirth || currentUser?.dateOfBirth,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Gender */}
                {(userProfile?.gender || currentUser?.gender) && (
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#5E17EB]" />
                    <span className="capitalize">
                      {userProfile?.gender || currentUser?.gender}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {posts.length}
                  </span>
                  <span className="text-sm text-gray-500">Posts</span>
                </div>
                <div
                  className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() =>
                    navigate(
                      `/followers/${currentUser?.id || currentUser?._id}`,
                    )
                  }
                >
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {userProfile?.followersCount ||
                      currentUser?.followersCount ||
                      0}
                  </span>
                  <span className="text-sm text-gray-500">Followers</span>
                </div>
                <div
                  className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() =>
                    navigate(
                      `/following/${currentUser?.id || currentUser?._id}`,
                    )
                  }
                >
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {userProfile?.followingCount ||
                      currentUser?.followingCount ||
                      0}
                  </span>
                  <span className="text-sm text-gray-500">Following</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Divider className="my-4" />

      {/* Posts Section */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner size="lg" className="text-[#5E17EB]" />
          </div>
        ) : posts?.length ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                isDetailsView={false}
                onRefetch={refreshUserPosts}
              />
            ))}
          </div>
        ) : (
          <NoPosts routeToLink="/" routeToMessage="Go to Your News Feed" />
        )}
      </div>

      {/* Cover Photo Edit Modal */}
      {isCoverEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-[600px]">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Cover Photo</h2>
                <Button
                  isIconOnly
                  className="bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  onPress={() => setIsCoverEditOpen(false)}
                >
                  ✕
                </Button>
              </div>
              <UpdateCoverPhoto
                onSuccess={() => {
                  setIsCoverEditOpen(false);
                  fetchUserProfile();
                  refreshUserProfile?.();
                  toast.success("Cover photo updated successfully! 🎉");
                }}
              />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
