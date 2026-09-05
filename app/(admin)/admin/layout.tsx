import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  // If not authenticated, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
