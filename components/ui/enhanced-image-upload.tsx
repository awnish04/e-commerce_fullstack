"use client";

import { useState, useEffect } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EnhancedImageUploadProps {
  disable?: boolean;
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];
  multiple?: boolean;
  showPreviewGrid?: boolean;
}

const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  disable,
  onChange,
  onRemove,
  value,
  multiple = false,
  showPreviewGrid = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadedImages = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );
    onChange(uploadedImages);

    // Reset input
    e.target.value = "";
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {showPreviewGrid && value.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative size-50 rounded-md overflow-hidden border"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                  disabled={disable}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Image
                fill
                className="object-cover"
                src={url}
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onUpload}
          disabled={disable}
          className="hidden"
          id="enhanced-image-upload"
        />
        <label htmlFor="enhanced-image-upload">
          <Button
            type="button"
            disabled={disable}
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("enhanced-image-upload")?.click();
            }}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            {multiple ? "Upload Images" : "Upload an Image"}
          </Button>
        </label>
      </div>
    </div>
  );
};

export default EnhancedImageUpload;
