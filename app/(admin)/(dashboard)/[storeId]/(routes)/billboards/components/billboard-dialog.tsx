"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Billboard, BillboardImage } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EnhancedImageUpload from "@/components/ui/enhanced-image-upload";

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: (Billboard & { images?: BillboardImage[] }) | null;
}

export const BillboardDialog: React.FC<BillboardDialogProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData
    ? "Update billboard details"
    : "Add a new billboard to your store";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          label: initialData.label,
          images: initialData.images?.map((image) => image.url) || [
            initialData.imageUrl,
          ],
        }
      : { label: "", images: [] },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${initialData.id}`,
          { label: data.label, images: data.images },
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      toast.success(toastMessage);
      onClose();
      form.reset();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <EnhancedImageUpload
                      value={field.value}
                      disable={loading}
                      onChange={(urls) =>
                        field.onChange([...field.value, ...urls])
                      }
                      onRemove={(url) =>
                        field.onChange(
                          field.value.filter((image) => image !== url),
                        )
                      }
                      multiple
                      showPreviewGrid={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : action}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
