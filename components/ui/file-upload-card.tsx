"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, File as FileIcon, CheckCircle2, Trash2, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Define the structure for a file being uploaded
export interface UploadedFile {
  id: string;
  file: File;
  progress: number; // 0-100
  status: "uploading" | "completed" | "error";
  preview?: string; // URL for image preview
}

// Define the props for the component
interface FileUploadCardProps {
  files: UploadedFile[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  onClose?: () => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  className?: string;
}

export const FileUploadCard = React.forwardRef<HTMLDivElement, FileUploadCardProps>(
  ({ 
    className, 
    files = [], 
    onFilesChange, 
    onFileRemove, 
    onClose, 
    acceptedFileTypes = "image/jpeg,image/png,image/webp,image/gif",
    maxFileSize = 50,
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Generate image previews for uploaded files
    React.useEffect(() => {
      const newPreviews: string[] = [];
      
      files.forEach((uploadedFile) => {
        if (uploadedFile.file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            setImagePreviews([...newPreviews]);
          };
          reader.readAsDataURL(uploadedFile.file);
        }
      });

      return () => {
        // Cleanup previews on unmount
        imagePreviews.forEach((preview) => {
          if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
          }
        });
      };
    }, [files]);

    // Handler for drag enter event
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    // Handler for drag leave event
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    // Handler for drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Handler for drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles && droppedFiles.length > 0) {
        onFilesChange(droppedFiles);
      }
    };

    // Handler for file input change
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesChange(selectedFiles);
      }
    };

    // Trigger file input click
    const triggerFileSelect = () => fileInputRef.current?.click();

    // Format file size for display
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 KB";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Check if file is an image
    const isImageFile = (file: File) => file.type.startsWith("image/");

    // Get image preview URL
    const getImagePreview = (file: UploadedFile, index: number) => {
      return imagePreviews[index] || "";
    };

    // Animation variants for Framer Motion
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

    const fileItemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    };

    const previewVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    };

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full max-w-2xl bg-background rounded-xl border shadow-sm",
          className
        )}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Upload files</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select and upload the files of your choice
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={cn(
              "mt-6 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer overflow-hidden",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/30 hover:border-primary/50",
              imagePreviews.length > 0 ? "p-4" : "p-8"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFileTypes}
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Show previews if images exist */}
            {imagePreviews.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {files.map((file, index) => {
                      if (isImageFile(file.file)) {
                        const preview = getImagePreview(file, index);
                        return (
                          <motion.div
                            key={file.id}
                            variants={previewVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative aspect-square group"
                          >
                            <div className="relative w-full h-full rounded-lg overflow-hidden border bg-muted">
                              {preview && (
                                <Image
                                  src={preview}
                                  alt={file.file.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                              {file.status === "uploading" && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="text-white text-xs font-medium">
                                    {file.progress}%
                                  </div>
                                </div>
                              )}
                              {file.status === "completed" && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle2 className="w-5 h-5 text-green-500 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onFileRemove(file.id);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        );
                      }
                      return null;
                    })}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col items-center justify-center py-6 border-t border-dashed">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">Add more images</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click or drag to upload additional files
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="font-semibold text-foreground">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, WEBP, and GIF formats, up to {maxFileSize} MB
                </p>
                <Button variant="outline" size="sm" className="mt-4 pointer-events-none">
                  Browse File
                </Button>
              </div>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="p-6 border-t">
            <h4 className="text-sm font-semibold mb-4">
              Uploaded Files ({files.length})
            </h4>
            <ul className="space-y-3">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.li
                    key={file.id}
                    variants={fileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isImageFile(file.file) ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted border">
                          {imagePreviews[index] && (
                            <Image
                              src={imagePreviews[index]}
                              alt={file.file.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background border text-xs font-bold text-muted-foreground flex-shrink-0">
                          {file.file.type.split("/")[1]?.toUpperCase().substring(0, 3) || "FILE"}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          {file.status === "uploading" && (
                            <span>
                              {formatFileSize((file.file.size * file.progress) / 100)} of{" "}
                              {formatFileSize(file.file.size)}
                            </span>
                          )}
                          {file.status === "completed" && (
                            <span>{formatFileSize(file.file.size)}</span>
                          )}
                          <span>•</span>
                          <span
                            className={cn({
                              "text-primary": file.status === "uploading",
                              "text-green-600 dark:text-green-400": file.status === "completed",
                            })}
                          >
                            {file.status === "uploading" ? "Uploading..." : "Completed"}
                          </span>
                        </div>
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="h-1 mt-2" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {file.status === "completed" && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-8 h-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onFileRemove(file.id)}
                      >
                        {file.status === "completed" ? (
                          <Trash2 className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </motion.div>
    );
  }
);

FileUploadCard.displayName = "FileUploadCard";
