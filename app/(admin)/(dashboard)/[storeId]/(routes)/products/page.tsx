import { format } from "date-fns";
import prismadb from "@/lib/db/prismadb";
import { formatter } from "@/lib/utils";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const products = await prismadb.product.findMany({
    where: { storeId },
    include: {
      category: true,
      variants: { include: { color: true, size: true } },
      images: {
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prismadb.category.findMany({
    where: { storeId },
    orderBy: { name: "asc" },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => {
    const variant = item.variants[0];

    return {
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(Number(variant?.price ?? item.price ?? 0)),
      category: item.category.name,
      size: variant?.size?.name || "",
      color: variant?.color?.name || "",
      stock: variant?.stock ?? item.stock ?? 0,
      imageUrl: item.images[0]?.url || null,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <ProductClient data={formattedProducts} categories={categories} />
      </div>
    </div>
  );
};

export default ProductsPage;
