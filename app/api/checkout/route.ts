import prismadb from "@/lib/db/prismadb";
import { stripe } from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return new NextResponse("Cart items are required", { status: 400 });
    }

    // Validate all cart items have variantId
    for (const item of cartItems) {
      if (!item.variantId) {
        return new NextResponse("All cart items must have a variantId", { status: 400 });
      }
      if (!item.quantity || item.quantity < 1) {
        return new NextResponse("Invalid quantity", { status: 400 });
      }
    }

    // Fetch all variants with their products
    const variantIds = cartItems.map((item: any) => item.variantId);
    const variants = await prismadb.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        color: true,
        size: true,
      },
    });

    if (variants.length !== variantIds.length) {
      return new NextResponse("One or more variants not found", { status: 404 });
    }

    // Validate stock availability
    for (const item of cartItems) {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) {
        return new NextResponse(`Variant ${item.variantId} not found`, { status: 404 });
      }
      if (!variant.isActive) {
        return new NextResponse(`${variant.product.name} is no longer available`, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return new NextResponse(
          `Insufficient stock for ${variant.product.name}. Available: ${variant.stock}`,
          { status: 400 }
        );
      }
    }

    // Create Stripe line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let subtotal = new Prisma.Decimal(0);

    for (const item of cartItems) {
      const variant = variants.find(v => v.id === item.variantId)!;
      const itemTotal = new Prisma.Decimal(variant.price).mul(item.quantity);
      subtotal = subtotal.add(itemTotal);

      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "USD",
          product_data: {
            name: `${variant.product.name} - ${variant.color?.name || ''} ${variant.size?.name || ''}`.trim(),
            images: variant.product.images.length > 0 ? [variant.product.images[0].url] : [],
          },
          unit_amount: Math.round(parseFloat(variant.price.toString()) * 100),
        },
      });
    }

    // Create order with PENDING status
    const shippingFee = new Prisma.Decimal(0); // Can be calculated based on location
    const discount = new Prisma.Decimal(0); // Can be applied from promo codes
    const totalPrice = subtotal.add(shippingFee).sub(discount);

    const order = await prismadb.order.create({
      data: {
        isPaid: false,
        phone: "",
        address: "",
        subtotal,
        shippingFee,
        discount,
        totalPrice,
        status: "PENDING",
        items: {
          create: cartItems.map((item: any) => {
            const variant = variants.find(v => v.id === item.variantId)!;
            return {
              productId: variant.productId,
              variantId: variant.id,
              quantity: item.quantity,
              price: variant.price, // Snapshot the price at time of order
            };
          }),
        },
      },
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
