# Cloudinary Integration with FileUploadCard

## Setup Cloudinary Upload

### 1. Install Cloudinary SDK

```bash
npm install cloudinary
```

### 2. Environment Variables

Add to your `.env` file:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. Create Upload API Route

Create `app/api/upload/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "products",
      resource_type: "auto",
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

## Usage with FileUploadCard

### Component with Real Upload

```tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { FileUploadCard, UploadedFile } from "@/components/ui/file-upload-card";
import toast from "react-hot-toast";

export default function ProductImageUpload({
  onImagesUploaded,
}: {
  onImagesUploaded: (urls: string[]) => void;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFilesChange = async (newFiles: File[]) => {
    // Add files to state with uploading status
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);

    // Upload each file
    for (const uploadedFile of uploadedFiles) {
      await uploadToCloudinary(uploadedFile);
    }
  };

  const uploadToCloudinary = async (uploadedFile: UploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile.file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;

          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? {
                    ...f,
                    progress,
                    status: progress >= 100 ? "completed" : "uploading",
                  }
                : f
            )
          );
        },
      });

      const imageUrl = response.data.url;
      
      // Add to uploaded URLs
      setUploadedUrls((prev) => {
        const newUrls = [...prev, imageUrl];
        onImagesUploaded(newUrls);
        return newUrls;
      });

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: "error" } : f
        )
      );
      
      toast.error("Failed to upload image");
    }
  };

  const handleFileRemove = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    // Remove from state
    setFiles((prev) => prev.filter((f) => f.id !== fileId));

    // If completed, remove URL
    if (file.status === "completed") {
      const index = files
        .filter((f) => f.status === "completed")
        .findIndex((f) => f.id === fileId);
      
      if (index !== -1) {
        const newUrls = uploadedUrls.filter((_, i) => i !== index);
        setUploadedUrls(newUrls);
        onImagesUploaded(newUrls);
      }
    }
  };

  return (
    <FileUploadCard
      files={files}
      onFilesChange={handleFilesChange}
      onFileRemove={handleFileRemove}
      acceptedFileTypes="image/jpeg,image/png,image/webp"
      maxFileSize={5}
    />
  );
}
```

## Integration with Product Dialog

Update your `product-dialog.tsx`:

```tsx
"use client";

import { useState } from "react";
import { FileUploadCard, UploadedFile } from "@/components/ui/file-upload-card";
import axios from "axios";
import toast from "react-hot-toast";

// Inside your ProductDialog component:

const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);
const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

// In your form:
<FormField
  control={form.control}
  name="images"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product Images</FormLabel>
      <FormControl>
        <FileUploadCard
          files={uploadFiles}
          onFilesChange={async (newFiles) => {
            const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
              id: crypto.randomUUID(),
              file,
              progress: 0,
              status: "uploading",
            }));

            setUploadFiles((prev) => [...prev, ...uploadedFiles]);

            // Upload to Cloudinary
            for (const uploadedFile of uploadedFiles) {
              const formData = new FormData();
              formData.append("file", uploadedFile.file);

              try {
                const response = await axios.post("/api/upload", formData, {
                  onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                      ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                      : 0;

                    setUploadFiles((prev) =>
                      prev.map((f) =>
                        f.id === uploadedFile.id
                          ? { ...f, progress, status: progress >= 100 ? "completed" : "uploading" }
                          : f
                      )
                    );
                  },
                });

                const imageUrl = response.data.url;
                setUploadedImageUrls((prev) => [...prev, imageUrl]);
                
                // Update form value
                field.onChange([
                  ...field.value,
                  { url: imageUrl }
                ]);

                toast.success("Image uploaded!");
              } catch (error) {
                setUploadFiles((prev) =>
                  prev.map((f) =>
                    f.id === uploadedFile.id ? { ...f, status: "error" } : f
                  )
                );
                toast.error("Upload failed");
              }
            }
          }}
          onFileRemove={(fileId) => {
            const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
            setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
            
            if (fileIndex !== -1 && fileIndex < field.value.length) {
              const newImages = field.value.filter((_, i) => i !== fileIndex);
              field.onChange(newImages);
            }
          }}
          acceptedFileTypes="image/jpeg,image/png,image/webp"
          maxFileSize={5}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Alternative: Direct Client Upload (No API Route)

For direct browser upload to Cloudinary:

```tsx
const uploadToCloudinaryDirect = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};
```

## Complete Example with All Features

```tsx
"use client";

import { useState } from "react";
import { FileUploadCard, UploadedFile } from "@/components/ui/file-upload-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

export function ProductImageUploadDialog({
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: (urls: string[]) => void;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFilesChange = async (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);

    for (const uploadedFile of uploadedFiles) {
      const formData = new FormData();
      formData.append("file", uploadedFile.file);

      try {
        const response = await axios.post("/api/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;

            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? { ...f, progress, status: progress >= 100 ? "completed" : "uploading" }
                  : f
              )
            );
          },
        });

        setUploadedUrls((prev) => [...prev, response.data.url]);
        toast.success("Image uploaded!");
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, status: "error" } : f
          )
        );
        toast.error("Upload failed");
      }
    }
  };

  const handleComplete = () => {
    onComplete(uploadedUrls);
    onClose();
    setFiles([]);
    setUploadedUrls([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload Product Images</DialogTitle>
        </DialogHeader>
        
        <FileUploadCard
          files={files}
          onFilesChange={handleFilesChange}
          onFileRemove={(id) => {
            const index = files.findIndex((f) => f.id === id);
            setFiles((prev) => prev.filter((f) => f.id !== id));
            if (index !== -1) {
              setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
            }
          }}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={uploadedUrls.length === 0}
          >
            Add {uploadedUrls.length} Image{uploadedUrls.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Testing

1. Upload a test image
2. Check progress bar animation
3. Verify preview appears
4. Test removal
5. Check multiple uploads
6. Test drag & drop

## Security Notes

- Always validate file types on the server
- Implement file size limits
- Use signed upload URLs for production
- Consider rate limiting
- Scan for malware if handling user uploads
