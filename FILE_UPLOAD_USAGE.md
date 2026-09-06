# File Upload Card Component Usage

## Features

✅ **Image Preview Grid** - Shows uploaded images in a beautiful grid
✅ **Drag & Drop** - Drag files directly into the component
✅ **Progress Tracking** - Visual progress bars for each upload
✅ **File Management** - Remove files individually
✅ **Responsive Design** - Works on all screen sizes
✅ **Animated Transitions** - Smooth animations with Framer Motion
✅ **Type Safety** - Full TypeScript support

## Installation

Make sure you have the required dependencies:

```bash
npm install framer-motion lucide-react
```

## Basic Usage

```tsx
"use client";

import { useState } from "react";
import { FileUploadCard, UploadedFile } from "@/components/ui/file-upload-card";

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);

    // Simulate upload progress
    uploadedFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, progress, status: progress >= 100 ? "completed" : "uploading" }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const handleFileRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <FileUploadCard
        files={files}
        onFilesChange={handleFilesChange}
        onFileRemove={handleFileRemove}
        acceptedFileTypes="image/*"
        maxFileSize={10}
      />
    </div>
  );
}
```

## Advanced Usage with Real Upload

```tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { FileUploadCard, UploadedFile } from "@/components/ui/file-upload-card";

export default function RealUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFilesChange = async (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);

    // Upload each file
    for (const uploadedFile of uploadedFiles) {
      await uploadFile(uploadedFile);
    }
  };

  const uploadFile = async (uploadedFile: UploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile.file);

    try {
      await axios.post("/api/upload", formData, {
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
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadedFile.id ? { ...f, status: "error" } : f
        )
      );
    }
  };

  const handleFileRemove = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <FileUploadCard
        files={files}
        onFilesChange={handleFilesChange}
        onFileRemove={handleFileRemove}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `UploadedFile[]` | `[]` | Array of files being uploaded |
| `onFilesChange` | `(files: File[]) => void` | required | Called when new files are selected |
| `onFileRemove` | `(id: string) => void` | required | Called when a file is removed |
| `onClose` | `() => void` | optional | Called when close button is clicked |
| `acceptedFileTypes` | `string` | `"image/*"` | Accepted file types (MIME types) |
| `maxFileSize` | `number` | `50` | Maximum file size in MB |
| `className` | `string` | `""` | Additional CSS classes |

## UploadedFile Interface

```typescript
interface UploadedFile {
  id: string;
  file: File;
  progress: number; // 0-100
  status: "uploading" | "completed" | "error";
  preview?: string; // Optional: URL for image preview
}
```

## Features in Detail

### 1. Image Preview Grid
- Automatically shows image thumbnails in a responsive grid
- Supports multiple images
- Hover effects on images
- Remove button on each image

### 2. Drag & Drop Zone
- Visual feedback when dragging files
- Works with multiple files
- Shows appropriate cursor states

### 3. Progress Tracking
- Individual progress bar for each file
- Percentage indicator
- Status badges (Uploading/Completed)

### 4. File List
- Shows file name, size, and status
- Thumbnail preview for images
- File type indicator for non-images
- Remove/delete buttons

### 5. Animations
- Smooth entrance animations
- File item animations
- Preview grid animations
- Exit animations when removing files

## Styling

The component uses Tailwind CSS and shadcn/ui components:
- Fully themeable with CSS variables
- Dark mode support
- Responsive design
- Customizable via className prop

## Integration with Product Upload

```tsx
// In your product form dialog
const [images, setImages] = useState<UploadedFile[]>([]);

<FormField
  control={form.control}
  name="images"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product Images</FormLabel>
      <FormControl>
        <FileUploadCard
          files={images}
          onFilesChange={(newFiles) => {
            // Handle file upload
            const uploaded = newFiles.map(file => ({
              id: crypto.randomUUID(),
              file,
              progress: 0,
              status: "uploading" as const
            }));
            setImages(prev => [...prev, ...uploaded]);
          }}
          onFileRemove={(id) => {
            setImages(prev => prev.filter(f => f.id !== id));
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

## Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Notes

- The component automatically generates image previews using FileReader API
- Memory cleanup is handled automatically
- Supports multiple file selection
- Works with both mouse and touch events
