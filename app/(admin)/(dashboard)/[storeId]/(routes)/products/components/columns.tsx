"use client";

import { ColumnDef } from "@tanstack/react-table";
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
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
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
