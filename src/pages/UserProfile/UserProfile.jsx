import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Button,
  Divider,
  Spinner,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Link as LinkIcon,
  Mail,
  Calendar,
  User,
  ImagePlus,
} from "lucide-react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import {
  getUserProfileService,
  getUserPostsService,
  followUserService,
} from "../../services/userServices";
import PostCard from "../../components/PostCard/PostCard";
import UpdateCoverPhoto from "../../components/UpdateCoverPhoto/UpdateCoverPhoto";
import { toast } from "react-toastify";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    token,
    user: currentUser,
    refreshUserProfile,
  } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isCoverEditOpen, setIsCoverEditOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const observer = useRef();

  // Fetch user profile
  useEffect(() => {
    if (!token || !id) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await getUserProfileService(token, id);
        const profileData = response.data.data?.user || response.data.data;
        setUserProfile(profileData);

        // Check API response first, then localStorage fallback
        const apiFollowStatus = response.data.data?.isFollowing;
        if (apiFollowStatus !== undefined) {
          setIsFollowing(apiFollowStatus);
        } else {
          // Fallback to localStorage
          const followedUsers = JSON.parse(
            localStorage.getItem("followedUsers") || "{}",
          );
          setIsFollowing(!!followedUsers[id]);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [token, id]);

  // Fetch user posts with pagination
  useEffect(() => {
    if (!token || !id || !hasMore) return;

    const fetchPosts = async () => {
      if (currentPage === 1) setPostsLoading(true);
      else setIsLoadingMore(true);

      try {
        const response = await getUserPostsService(token, id, currentPage);
        const newPosts = response.data.data?.posts || [];

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => {
            if (currentPage === 1) return newPosts;

            // Filter out duplicates by checking existing post IDs
            const existingIds = new Set(prevPosts.map((p) => p._id));
            const uniqueNewPosts = newPosts.filter(
              (p) => !existingIds.has(p._id),
            );

            // If no unique posts, we've reached the end
            if (uniqueNewPosts.length === 0) {
              setHasMore(false);
              return prevPosts;
            }

            return [...prevPosts, ...uniqueNewPosts];
          });
        }
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setPostsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchPosts();
  }, [token, id, currentPage, hasMore]);

  // Infinite scroll observer
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore],
  );

  // Handle follow/unfollow
  const handleFollowClick = async () => {
    if (followLoading || !userProfile) return;

    setFollowLoading(true);
    try {
      const response = await followUserService(token, userProfile._id);
      const { following } = response.data.data;

      setIsFollowing(following);

      // Update localStorage to persist follow status
      const followedUsers = JSON.parse(
        localStorage.getItem("followedUsers") || "{}",
      );
      if (following) {
        followedUsers[userProfile._id] = true;
      } else {
        delete followedUsers[userProfile._id];
      }
      localStorage.setItem("followedUsers", JSON.stringify(followedUsers));

      // Refresh user profile to update following count
      refreshUserProfile?.();

      toast.success(
        following
          ? "User followed successfully! 🎉"
          : "User unfollowed successfully",
      );

      // Update profile follower count
      setUserProfile((prev) => ({
        ...prev,
        followersCount: following
          ? (prev.followersCount || 0) + 1
          : Math.max(0, (prev.followersCount || 0) - 1),
      }));
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast.error(error.response?.data?.message || "Failed to follow user");
    } finally {
      setFollowLoading(false);
    }
  };

  // Refresh posts
  const refreshPosts = async () => {
    setPostsLoading(true);
    setHasMore(true);
    setCurrentPage(1);

    try {
      const response = await getUserPostsService(token, id, 1);
      const newPosts = response.data.data?.posts || [];
      setPosts(newPosts);
    } catch (error) {
      console.error("Failed to refresh posts:", error);
      toast.error("Failed to refresh posts");
    } finally {
      setPostsLoading(false);
    }
  };

  // Check if viewing own profile
  const currentUserId = currentUser?.id || currentUser?._id;
  const profileUserId = userProfile?._id || userProfile?.id;
  const isOwnProfile = Boolean(
    currentUserId && profileUserId && currentUserId === profileUserId,
  );

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" className="text-[#5E17EB]" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">User not found</p>
        <Button
          color="primary"
          onPress={() => navigate("/")}
          startContent={<ArrowLeft size={18} />}
        >
          Back to Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      {/* Back Button */}
      <div className="w-full mb-4">
        <Button
          isIconOnly
          className="bg-transparent"
          onPress={() => navigate(-1)}
          startContent={<ArrowLeft size={20} />}
        />
      </div>

      {/* Cover Photo Banner */}
      <div className="relative w-full mb-10 rounded-xl overflow-hidden group">
        <img
          src={
            userProfile.cover ||
            "https://placehold.co/1200x300/5E17EB/FFFFFF?text=Cover+Photo"
          }
          alt="Cover photo"
          className="w-full h-48 object-cover"
        />

        {/* Edit Icon Overlay (Only for own profile) */}
        {isOwnProfile && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              isIconOnly
              className="bg-white/90 hover:bg-white text-[#5E17EB] rounded-full"
              onPress={() => setIsCoverEditOpen(true)}
              startContent={<ImagePlus size={24} />}
            />
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="w-full shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 mb-6 -mt-20">
        <CardBody className="py-6 px-5">
          <div className="flex gap-4 items-start">
            {/* Avatar */}
            <Avatar
              src={userProfile.photo || "https://via.placeholder.com/120"}
              alt={userProfile.name}
              className="w-32 h-32 text-large ring-4 ring-white dark:ring-gray-800"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userProfile.name || "User"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{userProfile.username || "username"}
                  </p>
                </div>

                {/* Follow/Unfollow Button */}
                {!isOwnProfile && (
                  <Button
                    color={isFollowing ? "danger" : "primary"}
                    variant={isFollowing ? "bordered" : "solid"}
                    onClick={handleFollowClick}
                    disabled={followLoading}
                    aria-busy={followLoading}
                    size="sm"
                  >
                    {followLoading ? (
                      <Spinner size="sm" />
                    ) : isFollowing ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </div>

              {/* User Details */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {/* Email */}
                {userProfile.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#5E17EB]" />
                    <a
                      href={`mailto:${userProfile.email}`}
                      className="text-[#5E17EB] hover:underline"
                    >
                      {userProfile.email}
                    </a>
                  </div>
                )}

                {/* Date of Birth */}
                {userProfile.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#5E17EB]" />
                    <span>
                      Born:{" "}
                      {new Date(userProfile.dateOfBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                  </div>
                )}

                {/* Gender */}
                {userProfile.gender && (
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#5E17EB]" />
                    <span className="capitalize">{userProfile.gender}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                  </span>
                  <span className="text-sm text-gray-500">Posts</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {userProfile.followersCount || 0}
                  </span>
                  <span className="text-sm text-gray-500">Followers</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {userProfile.followingCount || 0}
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
        {postsLoading && posts.length === 0 ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner size="lg" className="text-[#5E17EB]" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="w-full shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
            <CardBody className="py-12 text-center">
              <p className="text-gray-500 text-lg">
                {userProfile.name} hasn't posted yet
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post, index) => {
              if (posts.length === index + 1) {
                return (
                  <div
                    ref={lastPostElementRef}
                    key={post._id}
                    className="w-full"
                  >
                    <PostCard
                      post={post}
                      isDetailsView={false}
                      onRefetch={refreshPosts}
                    />
                  </div>
                );
              }
              return (
                <PostCard
                  key={post._id}
                  post={post}
                  isDetailsView={false}
                  onRefetch={refreshPosts}
                />
              );
            })}

            {isLoadingMore && (
              <div className="py-6 flex justify-center w-full">
                <Spinner size="md" className="text-[#5E17EB]" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cover Photo Edit Modal */}
      {isCoverEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-[600px]">
            <CardHeader className="flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold">Update Cover Photo</h2>
              <Button
                isIconOnly
                className="bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onPress={() => setIsCoverEditOpen(false)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardBody className="p-6 pt-0">
              <UpdateCoverPhoto
                onSuccess={() => {
                  setIsCoverEditOpen(false);
                  // Refresh the user profile to show updated cover
                  const fetchProfile = async () => {
                    try {
                      const response = await getUserProfileService(token, id);
                      setUserProfile(
                        response.data.data?.user || response.data.data,
                      );
                    } catch (error) {
                      console.error("Failed to refresh profile", error);
                    }
                  };
                  fetchProfile();
                }}
              />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
