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
  Select,
  SelectItem,
} from "@heroui/react";
import { Globe, Users, Lock } from "lucide-react";

export default function EditPostModal({
  isOpen,
  onClose,
  postId,
  token,
  fetchPostDetails,
  onUpdate,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [body, setBody] = useState("");
  const [serverImageUrl, setServerImageUrl] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  const newImagePreview = useMemo(() => {
    if (!newImageFile) return "";
    return URL.createObjectURL(newImageFile);
  }, [newImageFile]);

  useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  useEffect(() => {
    if (!isOpen || !postId) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchPostDetails(token, postId);

        // Adjust this depending on your API shape
        const data = res?.data?.data?.post || setBody(data?.body || "");
        setServerImageUrl(data?.image || "");
        setPrivacy(data?.privacy || "public");
        setNewImageFile(null);
        setRemoveImage(false);
      } catch (err) {
        console.error("Failed to load post details:", err);
        // Let parent toast if you want; or you can toast here
        onClose?.();
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isOpen, postId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setNewImageFile(null);
  };

  const handleSave = async () => {
    if (!postId) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onUpdate({
        postId,
        body,
        image: newImageFile,
        removeImage,
        privacy,
      });
      onClose?.();
    } catch (err) {
      console.error("Update failed:", err);
      // parent can toast; keep modal open
    } finally {
      setIsSaving(false);
    }
  };

  const showExistingImage =
    Boolean(serverImageUrl) && !removeImage && !newImageFile;

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit your post
            </ModalHeader>

            <ModalBody>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
                  <Textarea
                    label="Post content"
                    placeholder="Update your post..."
                    value={body}
                    onValueChange={setBody}
                    minRows={4}
                    className="w-full"
                  />

                  {/* Privacy selector */}
                  <Select
                    label="Privacy"
                    selectedKeys={[privacy]}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="w-full"
                    startContent={
                      privacy === "public" ? (
                        <Globe size={16} />
                      ) : privacy === "following" ? (
                        <Users size={16} />
                      ) : (
                        <Lock size={16} />
                      )
                    }
                  >
                    <SelectItem
                      key="public"
                      value="public"
                      startContent={<Globe size={16} />}
                    >
                      Public
                    </SelectItem>
                    <SelectItem
                      key="following"
                      value="following"
                      startContent={<Users size={16} />}
                    >
                      Followers
                    </SelectItem>
                    <SelectItem
                      key="only_me"
                      value="only_me"
                      startContent={<Lock size={16} />}
                    >
                      Only Me
                    </SelectItem>
                  </Select>

                  {/* Image preview area - styled similar to PostCard */}
                  {(showExistingImage || newImagePreview) && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={newImagePreview || serverImageUrl}
                        alt="post preview"
                        className="w-full h-auto max-h-[450px] object-cover hover:scale-[1.01] transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 items-center">
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isSaving}
                        className="block text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-700"
                      />
                    </label>

                    {(serverImageUrl || newImageFile) && (
                      <Button
                        color="danger"
                        variant="light"
                        onPress={handleRemoveImage}
                        disabled={isSaving}
                      >
                        Remove image
                      </Button>
                    )}
                  </div>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={close}
                disabled={isSaving || isLoading}
              >
                Cancel
              </Button>

              <Button
                color="primary"
                onPress={handleSave}
                disabled={isSaving || isLoading}
                aria-busy={isSaving}
              >
                {isSaving ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  "Save changes"
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
