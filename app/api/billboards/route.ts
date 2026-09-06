import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth";
import prismadb from "@/lib/db/prismadb";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { label, imageUrl, images = [], isActive } = body;
    const imageUrls = images.length ? images : imageUrl ? [imageUrl] : [];

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrls.length) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl: imageUrls[0],
        isActive: isActive !== false,
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

export async function GET() {
  try {
    const billboards = await prismadb.billboard.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.error("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
