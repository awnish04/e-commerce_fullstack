"use client";

import * as React from "react";
import {
  ChevronRight,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Camera,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

interface ProductDetailModernProps {
  product: Product;
}

const StarRating = ({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-muted-foreground/50",
        )}
      />
    ))}
    <span className="ml-2 text-sm font-medium text-muted-foreground">
      {rating.toFixed(1)}
    </span>
  </div>
);

export const ProductDetailModern: React.FC<ProductDetailModernProps> = ({
  product,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const cart = useCart();

  const handleAddToCart = () => {
    cart.addItem(product);
    toast.success("Added to cart!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      toast.success("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-background text-foreground">
      {/* Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center text-sm text-muted-foreground mb-4"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/category" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <div /> {/* Spacer */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorited && "fill-red-500 text-red-500",
              )}
            />
            <span className="sr-only">Favorite</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border bg-gray-100 dark:bg-gray-800"
            >
              <Image
                src={
                  product.images[currentImageIndex]?.url || "/placeholder.png"
                }
                alt={`${product.name} image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    currentImageIndex === index
                      ? "bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                  )}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="h-4 w-4" /> Find Similar
            </Button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {product.images.slice(0, 4).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300",
                )}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <div className="mb-4">
            {product.category && (
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${(Number(product.price) * 1.2).toFixed(2)}
            </span>
            <Badge variant="destructive" className="ml-2">
              Save 20%
            </Badge>
          </div>

          <div className="mb-6">
            <StarRating rating={4.8} />
            <p className="text-sm text-muted-foreground mt-1">
              Based on 127 reviews
            </p>
          </div>

          <div className="flex gap-2 my-6">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Buy Now
            </Button>
          </div>

          {/* Product Attributes */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b">
            {product.size && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Size:</span>
                <Badge variant="outline" className="font-semibold">
                  {product.size}
                </Badge>
              </div>
            )}
            {product.color && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Color:</span>
                <Badge variant="outline" className="font-semibold">
                  {product.color}
                </Badge>
              </div>
            )}
            {product.stock !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Availability:
                </span>
                <Badge
                  variant={(product.stock ?? 0) > 0 ? "default" : "destructive"}
                >
                  {(product.stock ?? 0) > 0
                    ? `${product.stock ?? 0} in stock`
                    : "Out of stock"}
                </Badge>
              </div>
            )}
          </div>

          {/* Features/Benefits */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Premium Quality</p>
                <p className="text-sm text-muted-foreground">
                  Crafted with high-quality materials built to last
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Free Shipping</p>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $100
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">30-Day Returns</p>
                <p className="text-sm text-muted-foreground">
                  Easy returns and exchanges within 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t">
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description ||
                `Experience unparalleled comfort and style with the ${product.name}. 
                Designed for those who demand both performance and aesthetics, this product 
                combines innovative materials with timeless design. Whether you're hitting 
                the streets or the gym, you'll feel confident and comfortable every step of the way.`}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
