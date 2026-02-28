import React, { useContext, useEffect, useState } from "react";
import { Avatar, Divider, Skeleton } from "@heroui/react";
import { Heart, MessageSquare } from "lucide-react";
import CommentReplyCreation from "../CommentReplyForm/CommentReplyForm";
import {
  createCommentReplyService,
  likeCommentService,
} from "../../services/commentsServices";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import CommentRepliesList from "../CommentRepliesList/CommentRepliesList";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CommentsList({
  comments,
  postID,
  onRefetch,
  isDetailsView,
  isLoadingMore,
}) {
  const { token, user } = useContext(AuthContext);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [openRepliesId, setOpenRepliesId] = useState(null);
  const [isLoadingReplyForId, setIsLoadingReplyForId] = useState(null);
  const [likedByCommentId, setLikedByCommentId] = useState({});
  const [likeCountByCommentId, setLikeCountByCommentId] = useState({});
  const navigate = useNavigate();
  if (!comments || comments.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4 text-center italic">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  const formatCommentDate = (dateString) => {
    return new Date(dateString)
      .toLocaleString("en-GB", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .replace(/\//g, "-")
      .replace(", ", " | ");
  };

  useEffect(() => {
    if (!comments) return;
    const likedMap = {};
    const countMap = {};
    comments.forEach((comment) => {
      const likes = comment.likes || [];
      const userId = user?.id || user?._id;
      likedMap[comment._id] = userId ? likes.includes(userId) : false;
      countMap[comment._id] = comment.likesCount ?? likes.length ?? 0;
    });
    setLikedByCommentId(likedMap);
    setLikeCountByCommentId(countMap);
  }, [comments, user]);

  const toggleLikeCommentHandler = async (commentId) => {
    try {
      const response = await likeCommentService(token, postID, commentId);
      const { liked, likesCount } = response.data.data;

      setLikedByCommentId((prev) => ({ ...prev, [commentId]: liked }));
      setLikeCountByCommentId((prev) => ({ ...prev, [commentId]: likesCount }));

      toast.success(
        liked ? "You Liked this comment 🎉" : "You unLiked this comment",
      );
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Failed to update like status");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-2 px-1">
      {comments.map((comment, index) => (
        <div key={comment._id} className="flex flex-col gap-1.5">
          <div className="flex gap-3 items-start">
            <Avatar
              src={
                comment.commentCreator?.photo ||
                "https://via.placeholder.com/40"
              }
              alt={comment.commentCreator?.name || "User"}
              size="sm"
              className="ring-2 ring-[#5E17EB] ring-offset-1 flex-shrink-0 mt-1"
            />
            <div className="flex flex-col w-full">
              <div className="bg-gray-100 dark:bg-gray-800/80 p-3 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {comment.commentCreator?.name || "Anonymous"}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {formatCommentDate(comment.createdAt)}
                  </span>
                </div>
                {/* Comment Text */}
                {comment.content && (
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}

                {/* Comment Image */}
                {comment.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={comment.image}
                      alt="comment media"
                      className="w-full max-h-60 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-1.5 ml-2 text-xs text-gray-500 font-medium">
                {comment.repliesCount > 0 && (
                  <button
                    className="ml-2 mt-1 text-xs text-[#5E17EB] hover:underline"
                    onClick={() =>
                      setOpenRepliesId((prev) =>
                        prev === comment._id ? null : comment._id,
                      )
                    }
                  >
                    {openRepliesId === comment._id
                      ? "Hide replies"
                      : `View replies (${comment.repliesCount})`}
                  </button>
                )}
                <button
                  className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
                  onClick={() => toggleLikeCommentHandler(comment._id)}
                >
                  <Heart
                    size={14}
                    fill={
                      likedByCommentId[comment._id] ? "currentColor" : "none"
                    }
                    className={
                      likedByCommentId[comment._id]
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  />
                  <span
                    className={
                      likedByCommentId[comment._id] ? "text-red-500" : ""
                    }
                  >
                    {likeCountByCommentId[comment._id] || 0}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-[#5E17EB] transition-colors cursor-pointer"
                  onClick={() => {
                    if (!isDetailsView) {
                      navigate(`/post/${postID}`, { replace: true });
                    } else {
                      setActiveReplyId((prev) =>
                        prev === comment._id ? null : comment._id,
                      );
                    }
                  }}
                >
                  <MessageSquare size={14} />{" "}
                  <span>{comment.repliesCount || 0} Reply</span>
                </button>
              </div>
            </div>
          </div>
          {activeReplyId === comment._id && (
            <CommentReplyCreation
              currentUser={user}
              onCancel={() => setActiveReplyId(null)}
              onSubmitReply={async (payload) => {
                try {
                  // Set loading state and keep replies open
                  setIsLoadingReplyForId(comment._id);
                  setOpenRepliesId(comment._id);

                  await createCommentReplyService(
                    token,
                    payload,
                    postID,
                    comment._id,
                  );

                  setActiveReplyId(null); // close reply box

                  // Trigger a refetch of this comment's replies by closing and reopening
                  // This shows the skeleton while replies are being fetched without blocking other comments
                  setOpenRepliesId(null);
                  setTimeout(() => {
                    setOpenRepliesId(comment._id);
                  }, 100);
                } catch (error) {
                  console.error("Error creating reply", error);
                  setIsLoadingReplyForId(null);
                } finally {
                  // Clear loading state after refetch completes
                  setTimeout(() => {
                    setIsLoadingReplyForId(null);
                  }, 500);
                }
              }}
            />
          )}
          <CommentRepliesList
            postId={postID}
            commentId={comment._id}
            isOpen={openRepliesId === comment._id}
            isLoadingReply={isLoadingReplyForId === comment._id}
          />
          {index !== comments.length - 1 && (
            <Divider className="my-2 ml-12 w-[calc(100%-3rem)] bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      ))}

      {/* Skeleton Loaders for Loading More Comments */}
      {isLoadingMore && (
        <>
          {[1, 2].map((skeleton) => (
            <div key={`skeleton-${skeleton}`} className="flex flex-col gap-1.5">
              <div className="flex gap-3 items-start">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex flex-col w-full gap-2">
                  <Skeleton className="w-32 h-4 rounded-lg" />
                  <div className="bg-gray-100 dark:bg-gray-800/80 p-3 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 space-y-2">
                    <Skeleton className="w-full h-4 rounded-lg" />
                    <Skeleton className="w-4/5 h-4 rounded-lg" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="w-8 h-4 rounded-lg" />
                    <Skeleton className="w-8 h-4 rounded-lg" />
                  </div>
                </div>
              </div>
              <Divider className="my-2 ml-12 w-[calc(100%-3rem)] bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
