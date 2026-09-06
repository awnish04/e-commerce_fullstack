"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { BillboardColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { BillboardDialog } from "./billboard-dialog";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BillboardDialog isOpen={open} onClose={() => setOpen(false)} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title={`Billboards (${data.length})`}
            description="Manage billboards for your store"
          />
          <Button size="sm" onClick={() => setOpen(true)}>
           
            Add New
          </Button>
        </div>
      
        <DataTable searchKey="label" columns={columns} data={data} />
      </div>
    </>
  );
};
