"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Product,
  ProductImage,
  ProductVariant,
  Category,
} from "@prisma/client";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MultiImageUpload from "@/components/ui/multi-image-upload";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  sizeName: z.string(),
  colorName: z.string(),
  stock: z.number().int().min(0, "Stock must be positive"),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?:
    | (Product & { images: ProductImage[]; variants?: ProductVariant[] })
    | null;
  categories: Category[];
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData
    ? "Update product details"
    : "Add a new product to your store";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          sku: initialData.variants?.[0]?.sku || "",
          description: initialData.description || "",
          categoryId: initialData.categoryId,
          sizeName: "",
          colorName: "",
          stock: initialData.variants?.[0]?.stock ?? 0,
          price: Number(
            initialData.variants?.[0]?.price ?? initialData.price ?? 0,
          ),
          isFeatured: initialData.isFeatured,
          isArchived: initialData.isArchived,
          images: initialData.images.map((img) => img.url),
        }
      : {
          name: "",
          slug: "",
          sku: "",
          description: "",
          price: 0,
          categoryId: "",
          sizeName: "",
          colorName: "",
          stock: 0,
          isFeatured: false,
          isArchived: false,
          images: [],
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/products/${initialData.id}`, {
          ...data,
          variants: [
            {
              sku: data.sku,
              price: data.price,
              stock: data.stock,
              sizeName: data.sizeName,
              colorName: data.colorName,
            },
          ],
        });
      } else {
        await axios.post("/api/products", {
          ...data,
          variants: [
            {
              sku: data.sku,
              price: data.price,
              stock: data.stock,
              sizeName: data.sizeName,
              colorName: data.colorName,
            },
          ],
        });
      }
      router.refresh();
      toast.success(toastMessage);
      onClose();
      form.reset();
    } catch (error) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      value={field.value}
                      disable={loading}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Product name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="product-slug"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="SKU-001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        disabled={loading}
                        placeholder="9.99"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Product description"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value || ""}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="S, M, L, XL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Red, Blue, Green"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="0"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>
                        This product will not appear anywhere in the store
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

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
