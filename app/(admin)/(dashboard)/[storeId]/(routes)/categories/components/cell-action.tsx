"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Billboard, Category } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/admin/modals/alert-modal";
import { CategoryColumn } from "./columns";
import { CategoryDialog } from "./category-dialog";

interface CellActionProps {
  data: CategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [billboards, setBillboards] = useState<Billboard[]>([]);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Category ID copied to clipboard.");
  };

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const [categoryResponse, billboardsResponse] = await Promise.all([
        axios.get(`/api/${params.storeId}/categories/${data.id}`),
        axios.get(`/api/${params.storeId}/billboards`),
      ]);
      setCategoryData(categoryResponse.data);
      setBillboards(billboardsResponse.data);
      setEditOpen(true);
    } catch {
      toast.error("Failed to load category data.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
      router.refresh();
      toast.success("Category deleted.");
    } catch {
      toast.error("Make sure you remove all products using this category first.");
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
      <CategoryDialog
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setCategoryData(null);
        }}
        initialData={categoryData}
        billboards={billboards}
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
          <DropdownMenuItem onClick={fetchCategoryData} disabled={loading}>
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
