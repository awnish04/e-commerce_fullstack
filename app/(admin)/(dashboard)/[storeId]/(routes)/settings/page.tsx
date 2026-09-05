import prismadb from "@/lib/db/prismadb";
import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { storeId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const store = await prismadb.store.findFirst({ where: { id: storeId } });
  if (!store) redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;