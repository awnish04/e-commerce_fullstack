import { format } from "date-fns";

import prismadb from "@/lib/db/prismadb";
import { formatter } from "@/lib/utils";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

const OrdersPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const { storeId } = await params;
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.items
      .map((orderItem) => orderItem.product.name)
      .join(","),
    totalPrice: formatter.format(
      item.items.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid:item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
