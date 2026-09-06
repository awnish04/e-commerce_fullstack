import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/db/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error:${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    // Update order with payment info
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        status: "CONFIRMED",
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        items: true,
      },
    });

    // Reduce stock for each variant in the order
    for (const item of order.items) {
      await prismadb.productVariant.update({
        where: {
          id: item.variantId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Optional: Mark variants as inactive if stock reaches zero
    await prismadb.productVariant.updateMany({
      where: {
        stock: {
          lte: 0,
        },
      },
      data: {
        isActive: false,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
