import { redirect } from "next/navigation";
import prismadb from "@/lib/db/prismadb";
import { getCurrentUser } from "@/lib/auth/auth";
import { AppSidebar } from "@/components/admin/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
    where: {
      id: storeId,
      userId: user.id,
    },
    select: { id: true, name: true },
  });

  if (!store) {
    redirect("/admin");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <AppSidebar user={user} store={store} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <BreadcrumbContent />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
