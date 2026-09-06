"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductImage, Category } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/admin/modals/alert-modal";
import { ProductColumn } from "./columns";
import { ProductDialog } from "./product-dialog";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [productData, setProductData] = useState<
    (Product & { images: ProductImage[] }) | null
  >(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Product ID copied to clipboard.");
  };

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [productResponse, categoriesResponse] = await Promise.all([
        axios.get(`/api/products/${data.id}`),
        axios.get(`/api/${params.storeId}/categories`),
      ]);
      setProductData(productResponse.data);
      setCategories(categoriesResponse.data);
      setEditOpen(true);
    } catch {
      toast.error("Failed to load product data.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      router.refresh();
      toast.success("Product deleted.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <ProductDialog
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setProductData(null);
        }}
        initialData={productData}
        categories={categories}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={fetchProductData} disabled={loading}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
