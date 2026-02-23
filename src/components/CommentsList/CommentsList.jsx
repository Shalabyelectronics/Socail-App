import React from "react";
import { Avatar, Divider } from "@heroui/react";
import { Heart, MessageSquare } from "lucide-react";

export default function CommentsList({ comments }) {
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
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              <div className="flex gap-4 mt-1.5 ml-2 text-xs text-gray-500 font-medium">
                <button className="flex items-center gap-1 hover:text-[#FF3131] transition-colors cursor-pointer">
                  <Heart size={14} /> <span>{comment.likes?.length || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-[#5E17EB] transition-colors cursor-pointer">
                  <MessageSquare size={14} />{" "}
                  <span>{comment.repliesCount || 0} Reply</span>
                </button>
              </div>
            </div>
          </div>
          {index !== comments.length - 1 && (
            <Divider className="my-2 ml-12 w-[calc(100%-3rem)] bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
}
