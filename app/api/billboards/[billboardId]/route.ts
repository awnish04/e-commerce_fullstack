import { getCurrentUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import prismadb from "@/lib/db/prismadb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { label, imageUrl, isActive } = body;

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    await prismadb.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
