import prismadb from "@/lib/db/prismadb";
import { stripe } from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST,PUT, DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  const { storeId } = await params;
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: { variants: true },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        // unit_amount: product.price.toNumber() * 100,
        unit_amount: Math.round(
          Number(product.price ?? product.variants[0]?.price ?? 0) * 100,
        ),
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: storeId,
      isPaid: false,
      subtotal: products.reduce(
        (total, product) =>
          total + Number(product.price ?? product.variants[0]?.price ?? 0),
        0,
      ),
      totalPrice: products.reduce(
        (total, product) =>
          total + Number(product.price ?? product.variants[0]?.price ?? 0),
        0,
      ),
      items: {
        create: productIds.map((productId: string) => ({
          productId,
          variantId:
            products.find((product) => product.id === productId)?.variants[0]
              ?.id ?? "",
          quantity: 1,
          price:
            products.find((product) => product.id === productId)?.price ?? 0,
        })),
      },
    },
  });

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
    },
  );
}
