import { Urbanist } from "next/font/google";
import Navbar from "@/components/store/navbar";
import Footer from "@/components/store/footer";
import ModalProvider from "@/components/providers/store/modal-provider";
import ToastProvider from "@/components/providers/store/toast-provider";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "Store",
  description: "Store",
};
export const dynamic = "force-dynamic";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={font.className}>
      <ModalProvider />
      <ToastProvider />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
