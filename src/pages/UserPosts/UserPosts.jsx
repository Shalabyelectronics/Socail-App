import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import PostCard from "../../components/PostCard/PostCard";
import { Spinner } from "@heroui/react";
import NoPosts from "../../components/NoPosts/NoPosts";
import { getUserPostsService } from "../../services/postServices";

export default function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useContext(AuthContext);

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
    refreshUserPosts();
  }, [token]);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : posts?.length ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            isDetailsView={false}
            onRefetch={refreshUserPosts}
          />
        ))
      ) : (
        <NoPosts routeToLink="/" routeToMessage="Go to Your News Feed" />
      )}
    </>
  );
}
