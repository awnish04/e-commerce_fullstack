import prismadb from "@/lib/db/prismadb";
import { getCurrentUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const user = await getCurrentUser();
    if (!user) return new NextResponse("Unauthenticated", { status: 401 });

    const { name } = await req.json();
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismadb.store.update({
      where: { id: storeId },
      data: { name },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const user = await getCurrentUser();
    if (!user) return new NextResponse("Unauthenticated", { status: 401 });
    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismadb.store.delete({ where: { id: storeId } });
    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}