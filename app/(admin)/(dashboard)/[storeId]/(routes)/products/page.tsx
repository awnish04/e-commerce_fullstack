import { format } from "date-fns";
import prismadb from "@/lib/db/prismadb";
import { formatter } from "@/lib/utils";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
  const { storeId } = await params;
  const products = await prismadb.product.findMany({
    where: { storeId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(typeof item.price === "number" ? item.price : 0),
    category: item.category.name,
    size: item.size || "",
    color: item.color || "",
    stock: item.stock,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
