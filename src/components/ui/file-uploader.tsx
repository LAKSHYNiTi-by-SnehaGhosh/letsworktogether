"use client";

import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { getUploadUrl } from "@/actions/storage-actions";
import { Upload, Loader2 } from "lucide-react";

// Assuming a standard button component exists or will be added
// import { Button } from "./button"; 
// We will use a standard HTML button for now with Tailwind classes to ensure it works without dependencies

interface FileUploaderProps {
  entityType: "TASK" | "COMMENT" | "PROJECT" | "USER_AVATAR";
  entityId: string;
  isPublic?: boolean;
  onUploadComplete?: (data: { fileUrl: string; fileName: string; fileSize: number; fileType: string }) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export function FileUploader({
  entityType,
  entityId,
  isPublic = false,
  onUploadComplete,
  onUploadError,
  className = "",
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(10);

    try {
      let finalFile = file;

      // 1. Client-Side Image Compression
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 2, // Max 2MB after compression
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        finalFile = await imageCompression(file, options);
      }
      
      setProgress(30);

      // 2. Get Presigned URL
      const response = await getUploadUrl({
        fileName: finalFile.name,
        fileType: finalFile.type,
        fileSize: finalFile.size,
        entityType,
        entityId,
        isPublic,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to generate upload URL");
      }

      const { uploadUrl, filePath } = response.data;
      setProgress(50);

      // 3. Upload to R2 directly from client
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: finalFile,
        headers: {
          "Content-Type": finalFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      setProgress(90);

      // 4. Construct Public URL or Private Path
      // Replace generic R2.dev domain with your custom public domain if configured
      const r2DevDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN_ID;
      const fileUrl = isPublic && r2DevDomain
        ? `https://pub-${r2DevDomain}.r2.dev/${filePath}`
        : filePath; 

      if (onUploadComplete) {
        onUploadComplete({
          fileUrl,
          fileName: finalFile.name,
          fileSize: finalFile.size,
          fileType: finalFile.type,
        });
      }

      setProgress(100);
    } catch (error: unknown) {
      if (onUploadError) {
        onUploadError((error as Error).message || "An error occurred during upload");
      }
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
      />
      
      <button 
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? `Uploading ${progress}%` : "Upload File"}
      </button>
    </div>
  );
}
