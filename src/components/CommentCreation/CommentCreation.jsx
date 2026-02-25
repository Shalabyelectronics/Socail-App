import React, { useState, useRef } from "react";
import { Avatar, Button } from "@heroui/react";
import { Image as ImageIcon, Send, X } from "lucide-react";

export default function CommentCreation({ currentUser, onCreateComment }) {
  const [body, setBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!body.trim() && !selectedFile) return;

    onCreateComment?.({
      body,
      image: selectedFile,
    });

    setBody("");
    handleRemoveImage();
  };

  return (
    <div className="flex gap-3 items-start mt-4">
      {/* Avatar */}
      <Avatar
        src={currentUser?.photo || "https://via.placeholder.com/40"}
        alt={currentUser?.name || "User"}
        size="sm"
        className="ring-2 ring-[#5E17EB] ring-offset-1 flex-shrink-0 mt-1"
      />

      {/* Comment Box */}
      <div className="flex flex-col w-full">
        <div className="bg-gray-100 dark:bg-gray-800/80 p-3 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-200"
            rows={Math.max(1, body.split("\n").length)}
          />

          {previewUrl && (
            <div className="relative mt-2">
              <img
                src={previewUrl}
                alt="preview"
                className="rounded-lg max-h-40 object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-[#FF3131]"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-2 ml-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-xs text-[#5E17EB] hover:text-[#FF3131]"
          >
            <ImageIcon size={14} />
            Photo
          </button>

          <Button
            size="sm"
            className="bg-[#5E17EB] text-white"
            isDisabled={!body.trim() && !selectedFile}
            endContent={<Send size={14} />}
            onClick={handleSubmit}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
