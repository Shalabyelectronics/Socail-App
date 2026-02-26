import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Divider,
  Tooltip,
} from "@heroui/react";
import { Globe, LockIcon } from "lucide-react";

export default function SharePostModal({ isOpen, onClose, onShare, post }) {
  const [thoughts, setThoughts] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useMemo(() => post?.user || {}, [post]);

  const reset = () => {
    setThoughts("");
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleConfirmShare = async () => {
    if (!post?._id) return;

    try {
      setIsSubmitting(true);

      // Use default text if user didn't write anything
      const bodyText = thoughts.trim() || "Check this out!";

      // parent will call sharePostService and refresh feed if needed
      await onShare?.({
        postId: post._id,
        body: bodyText,
      });

      reset();
      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {}}
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="lg"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-gray-900 dark:text-white">
              Share post
            </ModalHeader>

            <ModalBody>
              {/* Your thoughts */}
              <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                <textarea
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  placeholder="Add your thoughts... (or we'll add 'Check this out!')"
                  className="w-full bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 text-sm min-h-[80px] placeholder:text-gray-400"
                  rows={3}
                />
              </div>

              <Divider className="my-2" />

              {/* Post preview */}
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={
                        user?.photo || "https://placehold.co/80x80?text=User"
                      }
                      alt={user?.name || "User"}
                      size="sm"
                      className="ring-2 ring-[#5E17EB] ring-offset-1"
                    />
                    <div className="leading-tight">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.username ? `@${user.username}` : "@default_user"}
                      </p>
                    </div>
                  </div>

                  <Tooltip content={post?.privacy || "public"}>
                    <span>
                      {(post?.privacy || "public") === "public" ? (
                        <Globe size={16} className="text-default-400" />
                      ) : (
                        <LockIcon size={16} className="text-default-400" />
                      )}
                    </span>
                  </Tooltip>
                </div>

                <Divider />

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
                  {post?.body && (
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-3">
                      {post.body}
                    </p>
                  )}

                  {post?.image && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={post.image}
                        alt="post media"
                        className="w-full max-h-[320px] object-cover"
                      />
                    </div>
                  )}

                  {/* If the post itself is already a shared post, preview the shared content too */}
                  {post?.isShare && post?.sharedPost && (
                    <div className="mt-3 p-3 border-l-4 border-[#5E17EB] bg-white dark:bg-gray-800/50 rounded-r-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Shared post from @
                        {post.sharedPost?.user?.username || "mystery lover"}
                      </p>
                      {post.sharedPost?.body && (
                        <p className="text-sm mb-2">{post.sharedPost.body}</p>
                      )}
                      {post.sharedPost?.image && (
                        <img
                          src={post.sharedPost.image}
                          alt="shared media"
                          className="rounded-lg max-h-56 object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[#5E17EB] hover:bg-[#FF3131] text-white"
                isLoading={isSubmitting}
                onPress={handleConfirmShare}
                isDisabled={!post?._id}
              >
                Share
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
