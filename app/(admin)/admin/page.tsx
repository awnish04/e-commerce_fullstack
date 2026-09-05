"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";

const AdminRootPage = () => {
  const router = useRouter();
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    // Check if user has stores
    const checkStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (response.ok) {
          const stores = await response.json();
          if (stores && stores.length > 0) {
            // User has stores, redirect to first one
            router.push(`/${stores[0].id}`);
          } else {
            // No stores, open modal
            if (!isOpen) {
              onOpen();
            }
          }
        }
      } catch (error) {
        console.error("Error checking stores:", error);
        // Open modal on error
        if (!isOpen) {
          onOpen();
        }
      }
    };

    checkStores();
  }, [isOpen, onOpen, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-muted-foreground">Setting up your workspace...</p>
      </div>
    </div>
  );
};

export default AdminRootPage;
