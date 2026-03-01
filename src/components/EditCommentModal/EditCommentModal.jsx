import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Spinner,
} from "@heroui/react";
import { ImagePlus, X } from "lucide-react";
import { updateCommentService } from "../../services/commentsServices";
import { toast } from "react-toastify";

export default function EditCommentModal({
  isOpen,
  onClose,
  comment,
  postId,
  token,
  onUpdate,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [serverImageUrl, setServerImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Preview for new uploaded image
  const newImagePreview = useMemo(() => {
    if (!newImageFile) return "";
    return URL.createObjectURL(newImageFile);
  }, [newImageFile]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  // Load comment data when modal opens
  useEffect(() => {
    if (!isOpen || !comment) return;

    setContent(comment.content || "");
    setServerImageUrl(comment.image || "");
    setNewImageFile(null);
    setRemoveImage(false);
  }, [isOpen, comment]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setRemoveImage(false); // If user picks a new image, don't remove server image
    }
  };

  const handleRemoveNewImage = () => {
    setNewImageFile(null);
  };

  const handleRemoveServerImage = () => {
    setRemoveImage(true);
    setServerImageUrl("");
  };

  const handleSave = async () => {
    if (!content.trim() && !newImageFile && !serverImageUrl) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        content: content.trim(),
      };

      // If user uploaded a new image, include it
      if (newImageFile) {
        payload.image = newImageFile;
      }

      await updateCommentService(token, postId, comment._id, payload);

      toast.success("Comment updated successfully! 🎉");
      onUpdate?.(); // Refresh comments list
      onClose();
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error(error.response?.data?.message || "Failed to update comment");
    } finally {
      setIsSaving(false);
    }
  };

  const displayImageUrl =
    newImagePreview || (!removeImage ? serverImageUrl : "");

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Comment
            </ModalHeader>

            <ModalBody>
              {/* Content Textarea */}
              <Textarea
                label="Comment Content"
                placeholder="Update your comment..."
                minRows={3}
                maxRows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSaving}
              />

              {/* Image Preview */}
              {displayImageUrl && (
                <div className="relative mt-2">
                  <img
                    src={displayImageUrl}
                    alt="Comment"
                    className="w-full max-h-60 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={
                      newImagePreview
                        ? handleRemoveNewImage
                        : handleRemoveServerImage
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    disabled={isSaving}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Upload New Image Button */}
              {!displayImageUrl && (
                <div className="mt-2">
                  <label
                    htmlFor="comment-image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-[#5E17EB] text-white rounded-lg hover:bg-[#4a12ba] cursor-pointer transition w-fit"
                  >
                    <ImagePlus size={18} />
                    <span>Upload Image</span>
                  </label>
                  <input
                    type="file"
                    id="comment-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSaving}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={close}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                color="primary"
                onPress={handleSave}
                disabled={isSaving}
                aria-busy={isSaving}
              >
                {isSaving ? <Spinner size="sm" color="white" /> : "Save"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
