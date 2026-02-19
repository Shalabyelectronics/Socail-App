import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import { newsFeedService } from "../../services/postServices";
import { Spinner } from "@heroui/react";
import PostCard from "../../components/PostCard/PostCard";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    console.log("Start fetching posts");
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const response = await newsFeedService(token);
        setPosts(response.data.data.posts);
        console.log(response.data.data.posts);
      } catch (error) {
        console.error(error.response.data.message);
      } finally {
        setIsLoading(false);
        console.log("Done from Fetching posts");
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
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </>
  );
}
