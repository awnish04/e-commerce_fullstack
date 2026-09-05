"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu as MenuIcon, Heart, Globe } from "lucide-react";
import { Category } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MainNavbarProps {
  categories: Category[];
}

export function MainNavbar({ categories }: MainNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/95 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Left: Shop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Shop</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-3">
                        <h4 className="font-medium leading-none mb-2">Discover</h4>
                        <Link
                          href="/category"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">All</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse our complete collection
                          </p>
                        </Link>
                        <Link
                          href="/collections/new"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none flex items-center gap-2">
                            New <Badge variant="secondary" className="text-xs">Latest</Badge>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            New arrivals and latest drops
                          </p>
                        </Link>
                        <Link
                          href="/collections/popular"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Popular</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Best sellers and trending items
                          </p>
                        </Link>
                        <Link
                          href="/collections/sale"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none flex items-center gap-2">
                            Sale <Badge variant="destructive" className="text-xs">-20%</Badge>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Special offers and discounts
                          </p>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/company" className={navigationMenuTriggerStyle()}>
                      Company
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blog" className={navigationMenuTriggerStyle()}>
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity">
            Nivest<sup className="text-xs">®</sup>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10"
              onClick={() => router.push('/search')}
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 hidden sm:flex"
            >
              <Heart className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 relative"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                0
              </Badge>
              <span className="sr-only">Cart</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 hidden sm:flex"
            >
              <Globe className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Language</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9 md:h-10 md:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white dark:bg-black">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Discover</p>
              <Link 
                href="/category" 
                className="block py-2 pl-4 text-base hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All
              </Link>
              <Link 
                href="/collections/new" 
                className="block py-2 pl-4 text-base hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                New
              </Link>
              <Link 
                href="/collections/popular" 
                className="block py-2 pl-4 text-base hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Popular
              </Link>
              <Link 
                href="/collections/sale" 
                className="block py-2 pl-4 text-base hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sale
              </Link>
            </div>

            {categories.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Categories</p>
                {categories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/category/${category.id}`} 
                    className="block py-2 pl-4 text-base hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <Link 
                href="/company" 
                className="block py-2 text-base hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Company
              </Link>
              <Link 
                href="/blog" 
                className="block py-2 text-base hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
