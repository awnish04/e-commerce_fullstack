"use client";

import Container from "@/components/store/ui/container";
import useCart from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic"
const Cartpage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Container>
        <div className="px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          {/* Back to shopping link */}
          <Link 
            href="/category" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Shopping Cart</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          {cart.items.length === 0 ? (
            // Empty cart state
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button size="lg" asChild>
                  <Link href="/category">
                    Start Shopping
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            // Cart with items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-6">Cart Items</h2>
                  <ul className="space-y-6">
                    {cart.items.map((item) => (
                      <CartItem key={item.id} data={item} />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Summary />
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Cartpage;
