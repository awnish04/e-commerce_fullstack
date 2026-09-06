"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  color: string;
  stock: number;
  isFeatured: boolean;
  isArchived: boolean;
  imageUrl: string | null;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return imageUrl ? (
        <div className="relative w-10 h-10 rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={row.original.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">No image</span>
        </div>
      );
    },
  },
  { 
    accessorKey: "name", 
    header: "Name",
  },
  { 
    accessorKey: "price", 
    header: "Price",
  },
  { 
    accessorKey: "category", 
    header: "Category",
  },
  { 
    accessorKey: "size", 
    header: "Size",
    cell: ({ row }) => row.original.size || "-",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => row.original.color || "-",
  },
  { 
    accessorKey: "stock", 
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return (
        <Badge variant={stock > 0 ? "default" : "destructive"}>
          {stock}
        </Badge>
      );
    },
  },
  { 
    accessorKey: "isFeatured", 
    header: "Featured",
    cell: ({ row }) => row.original.isFeatured ? "Yes" : "No",
  },
  { 
    accessorKey: "isArchived", 
    header: "Archived",
    cell: ({ row }) => row.original.isArchived ? "Yes" : "No",
  },
  { 
    accessorKey: "createdAt", 
    header: "Date",
  },
  { 
    id: "actions", 
    cell: ({ row }) => <CellAction data={row.original} /> 
  },
];
