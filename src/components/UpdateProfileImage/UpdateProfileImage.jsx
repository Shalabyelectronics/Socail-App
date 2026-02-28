import React, { useState, useRef, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Skeleton,
} from "@heroui/react";
import { Camera, Upload, X } from "lucide-react";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { uploadProfileImageService } from "../../services/authServices";
import { toast } from "react-toastify";

export default function UpdateProfileImage() {
  const { token, userPhoto, setUserPhoto } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    userPhoto || "https://via.placeholder.com/150?text=User",
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
    setPreviewUrl(userPhoto || "https://via.placeholder.com/150?text=User");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const response = await uploadProfileImageService(token, {
        photo: selectedFile,
      });
      toast.success("Profile photo uploaded successfully ✅");
      setUserPhoto(response.data.data.photo);
    } catch (error) {
      console.error(error);
      toast.error("There is error uploading a photo! ⚠️");
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Card className="w-full max-w-[600px] shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
      <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
        <div className="p-4 bg-[#5E17EB]/10 rounded-full mb-2">
          <Camera size={32} className="text-[#5E17EB]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Profile Picture
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Update your profile photo to personalize your account
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardBody className="flex flex-col items-center gap-6 py-6 px-8">
          <div className="relative group">
            {isLoading ? (
              <Skeleton className="flex rounded-full w-32 h-32" />
            ) : (
              <Avatar
                src={previewUrl}
                className="w-32 h-32 text-large ring-4 ring-[#5E17EB]/20 ring-offset-4 dark:ring-offset-gray-900"
              />
            )}

            {selectedFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-white dark:bg-gray-800 text-[#FF3131] p-1.5 rounded-full shadow-md hover:bg-[#FF3131] hover:text-white transition-colors border border-gray-200 dark:border-gray-700 z-10"
              >
                <X size={16} />
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
              className="w-full sm:w-auto bg-[#5E17EB]/10 text-[#5E17EB] font-medium hover:bg-[#5E17EB]/20 transition-colors"
              startContent={<Upload size={18} />}
            >
              Choose New Image
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Recommended size: 500x500px. Maximum file size: 5MB.
            </p>
          </div>
        </CardBody>

        <CardFooter className="px-8 pb-8 pt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={!selectedFile}
            className="w-full bg-[#5E17EB] hover:bg-[#FF3131] text-white font-medium py-6 rounded-xl transition-colors duration-300 shadow-md text-md"
          >
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
