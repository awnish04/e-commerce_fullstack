import prismadb from "@/lib/db/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: Promise<{ billboardId: string }>;
}) => {
  const { billboardId } = await params;
  const billboard = await prismadb.billboard.findUnique({
    where: { id: billboardId },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
