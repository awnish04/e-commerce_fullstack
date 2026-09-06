import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import prismadb from "@/lib/db/prismadb";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;
    const body = await req.json();

    const { label, imageUrl, images = [] } = body;
    const imageUrls = images.length ? images : imageUrl ? [imageUrl] : [];

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrls.length) {
      return new NextResponse("Image URL is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!prismadb || !prismadb.billboard) {
      console.error("Database not initialized");
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl: imageUrls[0],
        store: {
          connect: { id: storeId },
        },
        images: {
          create: imageUrls.map((url: string, sortOrder: number) => ({
            url,
            sortOrder,
          })),
        },
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params;
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: { storeId },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.error("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
