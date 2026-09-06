"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/admin/modals/alert-modal";
import { BillboardColumn } from "./columns";
import { BillboardDialog } from "./billboard-dialog";

interface CellActionProps {
  data: BillboardColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [billboardData, setBillboardData] = useState<Billboard | null>(null);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard ID copied to clipboard.");
  };

  const fetchBillboardData = async () => {
    try {
      const response = await axios.get(`/api/${params.storeId}/billboards/${data.id}`);
      setBillboardData(response.data);
      setEditOpen(true);
    } catch {
      toast.error("Failed to load billboard data.");
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      router.refresh();
      toast.success("Billboard deleted.");
    } catch {
      toast.error("Make sure you remove all categories using this billboard first.");
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
      <BillboardDialog
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setBillboardData(null);
        }}
        initialData={billboardData}
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
          <DropdownMenuItem onClick={fetchBillboardData}>
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
