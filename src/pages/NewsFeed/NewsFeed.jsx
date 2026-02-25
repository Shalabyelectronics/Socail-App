import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { AuthContext } from "../../components/AuthContext/AuthContextProvider";
import { newsFeedService } from "../../services/postServices";
import { Spinner } from "@heroui/react";
import PostCard from "../../components/PostCard/PostCard";
import NoPosts from "../../components/NoPosts/NoPosts";
import { toast } from "react-toastify";
import PostCreation from "./../../components/PostCreation/PostCreation";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { token, user } = useContext(AuthContext);

  const observer = useRef();

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
  useEffect(() => {
    const getPosts = async () => {
      if (currentPage === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      try {
        const response = await newsFeedService(token, currentPage);
        const newPosts = response.data.data.posts;

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) =>
            currentPage === 1 ? newPosts : [...prevPosts, ...newPosts.slice(1)],
          );
        }
      } catch (error) {
        console.error(error.response?.data.message || "Error fetching Posts");
        toast.error(error.response?.data.message || "Error fetching Posts");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };
    if (hasMore) {
      getPosts();
    }
  }, [token, currentPage, hasMore]);
  if (isLoading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" className="text-[#5E17EB]" />
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <NoPosts routeToLink="/profile" routeToMessage="Go to Your Profile" />
    );
  }

  const refreshPosts = async () => {
    setIsLoading(true);
    setHasMore(true);
    setCurrentPage(1);

    try {
      const response = await newsFeedService(token);
      const newsPosts = response.data.data.posts;
      setPosts(newsPosts);
    } catch (error) {
      console.error(error.response?.data.message || "Error fetching Posts");
      toast.error(error.response?.data.message || "Error fetching Posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      <PostCreation currentUser={user} onCreatePost={refreshPosts} />
      {posts.map((post, index) => {
        // 6. Check if this is the very last post in the current array
        if (posts.length === index + 1) {
          return (
            // Attach the observer ref to this specific element
            <div ref={lastPostElementRef} key={post._id} className="w-full">
              <PostCard post={post} isDetailsView={false} />
            </div>
          );
        }

        // Render normal posts without the ref
        return <PostCard key={post._id} post={post} isDetailsView={false} />;
      })}

      {isLoadingMore && (
        <div className="py-6 flex justify-center w-full">
          <Spinner size="md" className="text-[#5E17EB]" />
        </div>
      )}
    </div>
  );
}
