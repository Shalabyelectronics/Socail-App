import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import { newsFeedService } from "../../services/postServices";
import { Spinner } from "@heroui/react";
import PostCard from "../../components/PostCard/PostCard";
import NoPosts from "../../components/NoPosts/NoPosts";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const response = await newsFeedService(token);
        setPosts(response.data.data.posts);
      } catch (error) {
        console.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    getPosts();
  }, [token]);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : posts.length ? (
        posts.map((post) => (
          <PostCard key={post._id} post={post} isDetailsView={false} />
        ))
      ) : (
        <NoPosts />
      )}
    </>
  );
}
