import React, { useState, useRef, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Skeleton,
} from "@heroui/react";
import { ImagePlus, Upload, X } from "lucide-react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { uploadCoverPhotoService } from "../../services/authServices";
import { toast } from "react-toastify";

export default function UpdateCoverPhoto({ onSuccess }) {
  const { token, user, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user?.cover ||
      "https://placehold.co/1200x300/5E17EB/FFFFFF?text=Cover+Photo",
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(
      user?.cover ||
        "https://placehold.co/1200x300/5E17EB/FFFFFF?text=Cover+Photo",
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const response = await uploadCoverPhotoService(token, {
        cover: selectedFile,
      });
      toast.success("Cover photo uploaded successfully ✅");

      // Update user with new cover photo
      setUser((prev) => ({
        ...prev,
        cover: response.data.data.cover,
      }));

      setSelectedFile(null);
      setPreviewUrl(response.data.data.cover);

      // Call onSuccess callback if provided (for modal integration)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("There is error uploading a cover photo! ⚠️");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[600px] shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
      <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
        <div className="p-4 bg-secondary-100 dark:bg-secondary-900/30 rounded-full mb-2">
          <ImagePlus
            size={32}
            className="text-secondary-600 dark:text-secondary-400"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Cover Photo
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Update your cover photo to personalize your profile
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardBody className="flex flex-col items-center gap-6 py-6 px-8">
          <div className="relative group w-full">
            {isLoading ? (
              <Skeleton className="flex rounded-lg w-full h-48" />
            ) : (
              <div className="rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={previewUrl}
                  alt="Cover photo preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {selectedFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-red-500 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors border border-gray-200 dark:border-gray-700 z-10"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 w-full mt-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />
            <Button
              type="button"
              variant="flat"
              onPress={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 font-medium hover:bg-secondary-200 dark:hover:bg-secondary-900/50 transition-colors"
              startContent={<Upload size={18} />}
            >
              Choose New Image
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Recommended size: 1200x300px. Maximum file size: 5MB.
            </p>
          </div>
        </CardBody>

        <CardFooter className="px-8 pb-8 pt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={!selectedFile}
            className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-6 rounded-xl transition-colors duration-300 shadow-md text-md"
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
