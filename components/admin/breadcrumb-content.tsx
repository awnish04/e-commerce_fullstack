"use client";

import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbContent() {
  const pathname = usePathname();
  
  // Generate breadcrumb label from pathname
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  
  // Get the last meaningful segment (skip UUIDs)
  let label = "Dashboard";
  for (let i = pathSegments.length - 1; i >= 0; i--) {
    const segment = pathSegments[i];
    // Skip UUIDs
    if (!segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      break;
    }
  }

  return <BreadcrumbPage>{label}</BreadcrumbPage>;
}
