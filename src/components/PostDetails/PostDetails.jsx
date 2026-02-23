import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "@heroui/react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import PostCard from "../PostCard/PostCard";
import CommentsList from "../CommentsList/CommentsList";
import { postDetailsService } from "../../services/postServices";
import { getCommentsService } from "../../services/commentsServices";

export default function PostDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    const getPostDetails = async () => {
      try {
        setIsLoading(true);
        const response = await postDetailsService(token, id);
        setPost(response.data.data.post);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPostDetails();
  }, [token, id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        setIsLoadingComments(true);
        const response = await getCommentsService(token, id, commentsPage, 2);
        const newComments = response.data.data.comments;

        if (commentsPage === 1) {
          setComments(newComments);
        } else {
          setComments((prev) => [...prev, ...newComments]);
        }

        const totalPages = response.data.meta.pagination.numberOfPages;
        if (commentsPage >= totalPages) {
          setHasMoreComments(false);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchComments();
  }, [token, id, commentsPage]);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
          <PostCard post={post} isDetailsView={true} />

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h3>
            {isLoadingComments ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : (
              <CommentsList comments={comments} />
            )}
            {hasMoreComments && !isLoadingComments && (
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                onClick={() => setCommentsPage((prev) => prev + 1)}
                className="w-full mt-4"
              >
                Load More Comments
              </Button>
            )}
          </div>

          <Button
            color="primary"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Back to Feed
          </Button>
        </div>
      )}
    </>
  );
}
