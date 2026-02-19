import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Tooltip,
  Divider,
} from "@heroui/react";
import {
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  BookmarkCheck,
  Globe,
  LockIcon,
} from "lucide-react";

export default function PostCard({ post }) {
  return (
    <>
      <Card
        className="w-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4"
      >
        {/* Header - User + time + privacy */}
        <CardHeader className="flex justify-between items-center px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.user.photo}
              alt={post.user.name}
              size="md"
              className="ring-2 ring-pink-500 ring-offset-2"
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {post.user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.user.username ? `@${post.user.username} • ` : ""}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Tooltip content={post.privacy}>
            <span>
              {post.privacy === "public" ? (
                <Globe size={16} className="text-default-400" />
              ) : (
                <LockIcon size={16} className="text-default-400" />
              )}
            </span>
          </Tooltip>
        </CardHeader>

        <Divider />

        {/* Body - Text + Image + Shared post */}
        <CardBody className="px-5 py-4">
          {post.body && (
            <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
              {post.body}
            </p>
          )}

          {post.image && (
            <div className="rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
              <img
                src={post.image}
                alt="post media"
                className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          )}

          {post.isShare && post.sharedPost && (
            <div className="mt-4 p-4 border-l-4 border-pink-500 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Shared post from{" "}
                {post.sharedPost?.user?.username
                  ? `@${post.sharedPost.user.username}`
                  : "Unknown user"}
              </p>
              {post.sharedPost.body && (
                <p className="mb-3">{post.sharedPost.body}</p>
              )}
              {post.sharedPost.image && (
                <img
                  src={post.sharedPost.image}
                  alt="shared media"
                  className="rounded-lg max-h-64 object-cover"
                />
              )}
            </div>
          )}
        </CardBody>

        {/* Footer - Likes, Comments, Shares with lucide icons 😘 */}
        <CardFooter className="px-5 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex gap-6 text-sm">
            <button className="flex items-center gap-1.5 hover:text-pink-600 transition-colors">
              <Heart size={16} /> <span>{post?.likesCount || 0}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-pink-600 transition-colors">
              <MessageCircle size={16} />{" "}
              <span>{post?.commentsCount || 0}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-pink-600 transition-colors">
              <Repeat size={16} /> <span>{post?.sharesCount || 0}</span>
            </button>
          </div>

          <button className="flex items-center  gap-1.5 text-sm text-gray-500 hover:text-pink-600 transition-colors">
            {post.bookmarked ? (
              <BookmarkCheck size={16} />
            ) : (
              <Bookmark size={16} />
            )}
          </button>
        </CardFooter>
      </Card>
    </>
  );
}
