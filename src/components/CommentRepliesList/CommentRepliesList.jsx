import React, { useEffect, useState, useContext } from "react";
import { Avatar, Divider, Spinner, Skeleton } from "@heroui/react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { getRepliesService } from "../../services/commentsServices";
import { useNavigate } from "react-router-dom";

export default function CommentRepliesList({
  postId,
  commentId,
  isOpen,
  isLoadingReply,
}) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReplies = async () => {
      try {
        setIsLoading(true);
        const response = await getRepliesService(token, postId, commentId);
        setReplies(response.data.data.replies);
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();
  }, [isOpen, token, postId, commentId]);

  if (!isOpen) return null;

  return (
    <div className="ml-12 mt-2 flex flex-col gap-3">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          {replies.map((reply) => (
            <div key={reply._id} className="flex gap-3 items-start">
              <Avatar
                src={
                  reply.commentCreator?.photo ||
                  "https://via.placeholder.com/40"
                }
                size="sm"
                className="ring-2 ring-[#5E17EB] ring-offset-1 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  navigate(
                    `/users/${reply.commentCreator?._id || reply.commentCreator?.id}`,
                  )
                }
              />

              <div className="bg-gray-100 dark:bg-gray-800/80 p-3 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">
                    {reply.commentCreator?.name || "Anonymous"}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>

                {reply.content && (
                  <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                )}

                {reply.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img
                      src={reply.image}
                      alt="reply media"
                      className="w-full max-h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Skeleton Loader for New Reply */}
          {isLoadingReply && (
            <div className="flex gap-3 items-start">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex flex-col w-full gap-2">
                <div className="bg-gray-100 dark:bg-gray-800/80 p-3 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 w-full space-y-2">
                  <Skeleton className="w-24 h-4 rounded-lg" />
                  <Skeleton className="w-full h-4 rounded-lg" />
                  <Skeleton className="w-3/4 h-4 rounded-lg" />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Divider className="my-2 ml-6 w-[calc(100%-2rem)]" />
    </div>
  );
}
