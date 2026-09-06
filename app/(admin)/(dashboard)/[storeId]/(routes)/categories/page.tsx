import { format } from "date-fns";
import prismadb from "@/lib/db/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;
  const categories = await prismadb.category.findMany({
    where: { storeId },
    include: { billboard: true },
    orderBy: { createdAt: "desc" },
  });

  const billboards = await prismadb.billboard.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard?.label || "No billboard",
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <CategoryClient data={formattedCategories} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoriesPage;
