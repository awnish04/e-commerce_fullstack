import { redirect } from "next/navigation";
import prismadb from "@/lib/db/prismadb";
import { getCurrentUser } from "@/lib/auth/auth";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbContent } from "@/components/admin/breadcrumb-content";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: { id: storeId },
  });

  if (!store) {
    redirect("/");
  }

  // Get all stores for the sidebar store switcher
  const stores = await prismadb.store.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={user} stores={stores} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-full" />
            <BreadcrumbContent />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
