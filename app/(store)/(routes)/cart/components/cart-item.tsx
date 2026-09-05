import Currency from "@/components/store/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/shared/types";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CartItemProps {
  data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <li className="flex gap-4 sm:gap-6 pb-6 border-b last:border-0">
      {/* Product Image */}
      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
        <Image
          fill
          src={data.images[0]?.url || "/placeholder.png"}
          alt={data.name}
          className="object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
              {data.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Attributes */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {data.color && (
              <div className="flex items-center gap-2">
                <span>Color:</span>
                <span className="font-medium">{data.color}</span>
              </div>
            )}
            {data.size && (
              <div className="flex items-center gap-2">
                <span>Size:</span>
                <span className="font-medium">{data.size}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={incrementQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <Currency value={Number(data.price) * quantity} className="text-lg font-bold" />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
