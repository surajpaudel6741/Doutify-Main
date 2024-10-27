import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
// import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"; // Adjust the path as needed
import { Button } from "./ui/Button"; // Adjust the path as needed

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ProfilePictureUpload = ({ onImageUpdate }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setShowCropDialog(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  const createCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = 600;
    canvas.height = 600;

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      600,
      600
    );

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (!blob) return;
      const previewUrl = URL.createObjectURL(blob);
      setPreviewUrl(previewUrl);
      setShowCropDialog(false);

      // Convert blob to File object for upload
      const file = new File([blob], "profile-picture.png", {
        type: "image/png",
      });
      if (onImageUpdate) {
        onImageUpdate(file);
      }
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Profile Picture Preview */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
          id="profile-upload"
        />
        <label
          htmlFor="profile-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {previewUrl ? "Change Picture" : "Upload Picture"}
        </label>
      </div>

      {/* Cropping Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[60vh] max-w-full"
                />
              </ReactCrop>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCropDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createCroppedImage}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for processing */}
      <canvas
        ref={previewCanvasRef}
        style={{
          display: "none",
        }}
      />
    </div>
  );
};

export default ProfilePictureUpload;
