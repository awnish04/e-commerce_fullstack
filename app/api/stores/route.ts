import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import prismadb from "@/lib/db/prismadb";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const store = await prismadb.store.findUnique({
      where: { userId: user.id },
    });
    return NextResponse.json(store ? [store] : []);
  } catch (error) {
    console.error("[STORES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { name } = await req.json();
    if (!name) return new NextResponse("Name is required", { status: 400 });

    const store = await prismadb.store.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        name,
        userId: user.id,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
