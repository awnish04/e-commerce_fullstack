import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/auth";
import prismadb from "@/lib/db/prismadb";

export default async function AdminRootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Provision the singleton for accounts created before automatic setup.
  const store = await prismadb.store.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: "My Store",
      userId: user.id,
    },
  });

  redirect(`/${store.id}`);
}
