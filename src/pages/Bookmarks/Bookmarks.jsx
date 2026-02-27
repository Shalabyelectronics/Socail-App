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

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastBookmarkedCount, setLastBookmarkedCount] = useState(0);
  const { token } = useContext(AuthContext);

  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoadingMore || !hasMore) return;
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

  const fetchPostsPage = async (page) => newsFeedService(token, page);

  // Filter to show only bookmarked posts
  const bookmarkedPosts = posts.filter((post) => post.bookmarked);

  useEffect(() => {
    const getPosts = async () => {
      // Don't fetch if no token (user not logged in yet)
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (currentPage === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      try {
        const response = await fetchPostsPage(currentPage);
        const newPosts = response.data.data.posts;

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) =>
            currentPage === 1 ? newPosts : [...prevPosts, ...newPosts.slice(1)],
          );

          // Check if we got any new bookmarked posts in this batch
          const newBookmarkedCount = newPosts.filter(
            (post) => post.bookmarked,
          ).length;

          // If no new bookmarked posts in this batch, stop loading more
          if (newBookmarkedCount === 0) {
            setHasMore(false);
          }
        }
      } catch (error) {
        // Don't show toast for 401 errors (user will be redirected to login)
        if (error.response?.status !== 401) {
          toast.error("Failed to load bookmarks");
          console.error("Error fetching bookmarks:", error);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    getPosts();
  }, [currentPage, token]);

  // Remove post from bookmarks when unbookmarked
  const handlePostUnbookmarked = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner label="Loading bookmarks..." color="secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookmarkedPosts.length === 0 ? (
        <NoPosts message="No bookmarked posts yet. Start bookmarking posts to see them here!" />
      ) : (
        <>
          {bookmarkedPosts.map((post, index) => (
            <div
              key={post._id}
              ref={
                bookmarkedPosts.length === index + 1 ? lastPostElementRef : null
              }
            >
              <PostCard
                post={post}
                onUnbookmark={() => handlePostUnbookmarked(post._id)}
              />
            </div>
          ))}
          {isLoadingMore && hasMore && (
            <div className="flex justify-center py-4">
              <Spinner size="sm" color="secondary" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
