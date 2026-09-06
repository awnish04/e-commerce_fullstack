"use client";

import { useState, useEffect } from "react";
import { ImagePlus, Trash, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MultiImageUploadProps {
  disable?: boolean;
  onChange: (value: string[]) => void;
  value: string[];
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  disable,
  onChange,
  value = [],
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const newImages: string[] = [];

    for (const file of fileArray) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    onChange([...value, ...newImages]);
    // Reset input
    e.target.value = "";
  };

  const onRemove = (urlToRemove: string) => {
    const filtered = value.filter((url) => url !== urlToRemove);
    onChange(filtered);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative w-[120px] h-[120px] rounded-md overflow-hidden border"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disable}
              >
                <X className="h-2 w-2" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              src={url}
              alt={`Product image ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onUpload}
          disabled={disable}
          className="hidden"
          id="multi-image-upload"
        />
        <label htmlFor="multi-image-upload">
          <Button
            type="button"
            disabled={disable}
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("multi-image-upload")?.click();
            }}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </label>
      </div>
    </div>
  );
};

export default MultiImageUpload;
