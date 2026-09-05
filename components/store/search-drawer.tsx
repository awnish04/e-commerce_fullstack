"use client";

import { useState, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";

interface SearchDrawerProps {
  storeId: string;
}

export function SearchDrawer({ storeId }: SearchDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/products?name=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, storeId]);

  const popularSearches = [
    "Running Shoes",
    "Sneakers",
    "Athletic Wear",
    "Workout Gear",
    "Casual Shoes",
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
          <Search className="h-4 w-4 md:h-5 md:w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Search Products</SheetTitle>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base md:text-lg"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-8">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {!isLoading && searchQuery && searchResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group border rounded-lg p-4 hover:shadow-lg transition-shadow"
                    onClick={() => setOpen(false)}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-md mb-3">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold">${product.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!isLoading && searchQuery && searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
            </div>
          )}

          {!searchQuery && !isLoading && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Popular Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(search)}
                      className="rounded-full"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/category"
                    className="block py-2 hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Browse All Products
                  </Link>
                  <Link
                    href="/collections/new-arrivals"
                    className="block py-2 hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/collections/sale"
                    className="block py-2 hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Sale Items
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
