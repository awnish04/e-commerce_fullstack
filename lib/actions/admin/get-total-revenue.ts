import prismadb from "@/lib/db/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  const totalrevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.items.reduce((orderSum, item) => {
      return orderSum + Number(item.product.price);
    }, 0);
    return total + orderTotal;
  }, 0);
  return totalrevenue;
};
