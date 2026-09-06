"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Billboard } from "@prisma/client";
import { CategoryColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { CategoryDialog } from "./category-dialog";

interface CategoryClientProps {
  data: CategoryColumn[];
  billboards: Billboard[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data, billboards }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CategoryDialog 
        isOpen={open} 
        onClose={() => setOpen(false)} 
        billboards={billboards}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading title={`Categories (${data.length})`} description="Manage categories for your store" />
          <Button size="sm" onClick={() => setOpen(true)}>
            Add New
          </Button>
        </div>
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </>
  );
};
