"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Category } from "@prisma/client";
import { ProductColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { ProductDialog } from "./product-dialog";

interface ProductClientProps {
  data: ProductColumn[];
  categories: Category[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data, categories }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ProductDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        categories={categories}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading title={`Products (${data.length})`} description="Manage products for your store" />
          <Button size="sm" onClick={() => setOpen(true)}>
             Add New
          </Button>
        </div>
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </>
  );
};
