import React, { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Divider,
  Spinner,
  Skeleton,
  Modal,
  ModalContent,
} from "@heroui/react";
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
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const handleOpenImagePreview = (imageUrl) => {
    if (!imageUrl) return;
    setPreviewImageUrl(imageUrl);
    setIsImagePreviewOpen(true);
  };

  const handleCloseImagePreview = () => {
    setIsImagePreviewOpen(false);
    setPreviewImageUrl("");
  };

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
                  <button
                    type="button"
                    onClick={() => handleOpenImagePreview(reply.image)}
                    className="mt-2 w-full rounded-lg overflow-hidden border cursor-zoom-in"
                    aria-label="Preview full reply image"
                  >
                    <img
                      src={reply.image}
                      alt="reply media"
                      className="w-full max-h-48 object-cover"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Skeleton Loader for New Reply */}
          {isLoadingReply && (
            <div className="flex gap-3 items-start">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
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

      <Modal
        isOpen={isImagePreviewOpen}
        onClose={handleCloseImagePreview}
        size="5xl"
        backdrop="blur"
      >
        <ModalContent>
          <div className="relative bg-black/95 rounded-xl p-2 md:p-4 flex items-center justify-center">
            <button
              type="button"
              onClick={handleCloseImagePreview}
              className="absolute top-3 right-3 z-10 bg-white/90 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-white"
              aria-label="Close image preview"
            >
              ✕
            </button>

            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Full reply preview"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            )}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
