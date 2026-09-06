import {
  LayoutDashboard,
  Image,
  FolderTree,
  Package,
  ShoppingCart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
}

export function getSidebarNavItems(storeId: string): NavItem[] {
  return [
    {
      title: "Overview",
      href: `/${storeId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Billboards",
      href: `/${storeId}/billboards`,
      icon: Image,
    },
    {
      title: "Categories",
      href: `/${storeId}/categories`,
      icon: FolderTree,
    },
    {
      title: "Products",
      href: `/${storeId}/products`,
      icon: Package,
    },
    {
      title: "Orders",
      href: `/${storeId}/orders`,
      icon: ShoppingCart,
    },
    {
      title: "Settings",
      href: `/${storeId}/settings`,
      icon: Settings,
    },
  ];
}
