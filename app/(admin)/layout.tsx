import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/admin/theme-provider";
import { ToasterProvider } from "@/components/providers/admin/toast-provider";
import { ModalProvider } from "@/components/providers/admin/modal-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToasterProvider />
        <ModalProvider />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
