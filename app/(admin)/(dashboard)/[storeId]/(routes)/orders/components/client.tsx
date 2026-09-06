"use client";

import { OrderColumn, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <DataTable searchKey="products" columns={columns} data={data} />
    </div>
  );
};
