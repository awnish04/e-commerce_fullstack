"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Currency from "@/components/store/ui/currency";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Lock, Truck } from "lucide-react";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const subtotal = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const totalPrice = subtotal + shippingCost + tax - discount;

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    // Simulate promo code validation
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SAVE10") {
        const discountAmount = subtotal * 0.1;
        setDiscount(discountAmount);
        toast.success("Promo code applied! 10% off");
      } else if (promoCode) {
        toast.error("Invalid promo code");
      }
      setIsApplyingPromo(false);
    }, 500);
  };

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        productIds: items.map((item) => item.id),
      }
    );
    window.location = response.data.url;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      {/* Promo Code */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Promo Code
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={applyPromoCode}
            disabled={!promoCode || isApplyingPromo}
          >
            {isApplyingPromo ? "..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <Currency value={subtotal} />
        </div>

        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </span>
          {shippingCost === 0 ? (
            <span className="text-green-600 font-medium">FREE</span>
          ) : (
            <Currency value={shippingCost} />
          )}
        </div>

        {shippingCost > 0 && (
          <p className="text-xs text-muted-foreground">
            Free shipping on orders over $100
          </p>
        )}

        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">Tax</span>
          <Currency value={tax} />
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-base text-green-600">
            <span>Discount</span>
            <span>-<Currency value={discount} /></span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-lg font-bold">Total</span>
        <Currency value={totalPrice} className="text-2xl font-bold" />
      </div>

      {/* Checkout Button */}
      <Button 
        onClick={onCheckout} 
        size="lg"
        className="w-full"
        disabled={items.length === 0}
      >
        <Lock className="h-4 w-4 mr-2" />
        Secure Checkout
      </Button>

      {/* Trust Badges */}
      <div className="pt-4 border-t space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Secure SSL Encryption</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>Free returns within 30 days</span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
