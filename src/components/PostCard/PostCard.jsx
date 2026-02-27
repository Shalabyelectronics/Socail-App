import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Tooltip,
  Divider,
  Spinner,
} from "@heroui/react";
import {
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Globe,
  LockIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../lib/tools";
import CommentsList from "../CommentsList/CommentsList";
import {
  bookmarkPostService,
  deletePostService,
  likePostService,
  sharePostService,
} from "../../services/postServices";
import SharePostModal from "../SharePostModal/SharePostModal";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { FeedContext } from "../FeedContext/FeedContextProvider";
import UserPostSetting from "./../UserPostSetting/UserPostSetting";
import DeletePostModal from "../DeletePostModal/DeletePostModal";
import EditPostModal from "../EditPostModal/EditPostModal";
import {
  postDetailsService,
  updatePostService,
} from "../../services/postServices";

export default function PostCard({
  post,
  isDetailsView,
  onRefetch,
  onUnbookmark,
}) {
  if (!post) return null;
  const navigate = useNavigate();

  const { token, user: currentUser } = useContext(AuthContext);
  const { refreshBookmarkCount } = useContext(FeedContext);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likesCount || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const currentUserId = currentUser?.id || currentUser?._id;
  const postOwnerId = post?.user?._id || post?.user?.id;
  const isOwner = Boolean(
    currentUserId && postOwnerId && currentUserId === postOwnerId,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const userId = currentUser?.id || currentUser?._id;
    const likes = post?.likes || [];
    setIsLiked(userId ? likes.includes(userId) : false);
    setLikeCount(post?.likesCount ?? likes.length ?? 0);
    setIsBookmarked(Boolean(post?.bookmarked));
  }, [post, currentUser]);

  const handleShare = async ({ postId, body }) => {
    try {
      await sharePostService(token, postId, body);
      toast.success("Post shared successfully!");
      onRefetch?.();
    } catch (error) {
      // Handle specific error codes
      if (error.response?.status === 409) {
        toast.error("You already shared this post!");
      } else {
        toast.error(error.response?.data?.message || "Failed to share post");
      }
      console.error("Share error:", error);
      throw error; // so modal keeps loading behavior consistent
    }
  };

  const getPostDetails = () => {
    if (!isDetailsView) {
      navigate(`/post/${post._id}`, { replace: true });
    } else {
      console.log("show comments");
    }
  };

  const toggleLikePostHandler = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      const response = await likePostService(token, post._id);
      const { liked, likesCount } = response.data.data;

      setIsLiked(liked); // Use response to set correct state
      setLikeCount(likesCount); // Use response to set correct count

      toast.success(liked ? "You Liked this post 🎉" : "You unLiked this post");
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Failed to update like status");
    } finally {
      setIsLikeLoading(false);
    }
  };
  const toggleBookmarkPostHandler = async () => {
    if (isBookmarkLoading) return;
    setIsBookmarkLoading(true);
    try {
      const response = await bookmarkPostService(token, post._id);

      const { bookmarked, bookmarksCount } = response.data.data;

      setIsBookmarked(bookmarked);

      toast.success(
        bookmarked
          ? "You Bookmarked this post 🎉"
          : "You unBookmarked this post",
      );

      refreshBookmarkCount?.();

      // If unbookmarking and callback provided, notify parent to remove from list
      if (!bookmarked && onUnbookmark) {
        onUnbookmark();
      }
    } catch (error) {
      console.error("Something went wrong", error);
      toast.error("Failed to update bookmark status");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isDeleteLoading) return;

    setIsDeleteLoading(true);
    try {
      await deletePostService(token, post._id);
      toast.success("Post deleted successfully ✅");

      setIsDeleteOpen(false);

      onRefetch?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleUpdate = async ({ postId, body, image, removeImage }) => {
    try {
      // Build payload for your update service
      // If your backend supports removing image via empty string or specific field,
      // adjust here.
      const payload = {
        body,
        image,
      };

      // If you KNOW your API supports remove:
      // payload.removeImage = removeImage;

      await updatePostService(token, postId, payload);

      toast.success("Post updated successfully ✅");
      onRefetch?.();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update post");
      throw error; // keeps modal consistent if you want to keep it open
    }
  };

  const postUser = post?.user || {};

  const showTopComment = post?.topComment ? [post.topComment] : [];

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
      <CardHeader className="flex justify-between items-center px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={postUser?.photo || "https://placehold.co/80x80?text=User"}
            alt={postUser?.name || "User"}
            size="md"
            className="ring-2 ring-pink-500 ring-offset-2"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {postUser?.name || "Anonymous hottie"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {postUser?.username
                ? `@${postUser.username} • `
                : "@default_user • "}
              {post?.createdAt
                ? new Date(post.createdAt)
                    .toLocaleString("en-GB", formattedDate)
                    .replace(/\//g, "-")
                    .replace(", ", " | ")
                : "Just now"}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 items-center">
          <Tooltip content={post?.privacy || "Unknown"}>
            <span>
              {(post?.privacy || "public") === "public" ? (
                <Globe size={16} className="text-default-400" />
              ) : (
                <LockIcon size={16} className="text-default-400" />
              )}
            </span>
          </Tooltip>
          <Tooltip content={"Edit/delete your post"}>
            <span>
              {isOwner && (
                <UserPostSetting
                  onEdit={() => setIsEditOpen(true)}
                  onDelete={() => setIsDeleteOpen(true)}
                />
              )}
            </span>
          </Tooltip>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="px-5 py-4">
        {post?.body && (
          <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
            {post.body}
          </p>
        )}

        {post?.image && (
          <div className="rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
            <img
              src={post.image}
              alt="post media"
              className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}

        {post?.isShare && post?.sharedPost && (
          <div className="mt-4 p-4 border-l-4 border-pink-500 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Shared post from @
              {post.sharedPost?.user?.username || "mystery lover"}
            </p>
            {post.sharedPost?.body && (
              <p className="mb-3">{post.sharedPost.body}</p>
            )}
            {post.sharedPost?.image && (
              <img
                src={post.sharedPost.image}
                alt="shared media"
                className="rounded-lg max-h-64 object-cover"
              />
            )}
          </div>
        )}
      </CardBody>

      <CardFooter className="px-5 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex gap-6 text-sm">
          <button
            className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer"
            onClick={toggleLikePostHandler}
            disabled={isLikeLoading}
            aria-busy={isLikeLoading}
          >
            <span className="inline-flex w-4 h-4 items-center justify-center">
              {isLikeLoading ? (
                <Spinner size="sm" color="danger" />
              ) : (
                <Heart
                  size={16}
                  fill={isLiked ? "currentColor" : "none"}
                  className={isLiked ? "text-red-500" : "text-gray-500"}
                />
              )}
            </span>

            <span className={isLiked ? "text-red-500" : ""}>
              {likeCount || 0}
            </span>
          </button>
          <button
            className="flex items-center gap-1.5 hover:text-pink-600 transition-colors cursor-pointer"
            onClick={() => getPostDetails()}
          >
            <MessageCircle size={16} /> <span>{post?.commentsCount || 0}</span>
          </button>
          <button
            className="flex items-center gap-1.5 hover:text-pink-600 transition-colors cursor-pointer"
            onClick={() => setIsShareOpen(true)}
          >
            <Repeat size={16} /> <span>{post?.sharesCount || 0}</span>
          </button>
        </div>

        <button
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-600 cursor-pointer transition-colors"
          onClick={toggleBookmarkPostHandler}
          disabled={isBookmarkLoading}
          aria-busy={isBookmarkLoading}
        >
          {isBookmarkLoading ? (
            <Spinner size="sm" />
          ) : (
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          )}
        </button>
      </CardFooter>
      {!isDetailsView && showTopComment.length > 0 && (
        <>
          <Divider />
          <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-900/30">
            <CommentsList
              comments={showTopComment}
              postID={post._id}
              isDetailsView={isDetailsView}
            />
          </div>
        </>
      )}
      <SharePostModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onShare={handleShare}
        post={post}
      />
      <DeletePostModal
        isOpen={isDeleteOpen}
        onClose={() => !isDeleteLoading && setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleteLoading}
      />
      <EditPostModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        postId={post._id}
        token={token}
        fetchPostDetails={postDetailsService}
        onUpdate={handleUpdate}
      />
    </Card>
  );
}
