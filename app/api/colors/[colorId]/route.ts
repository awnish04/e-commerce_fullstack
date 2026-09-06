import { getCurrentUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import prismadb from "@/lib/db/prismadb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, hexCode } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        hexCode: hexCode || null,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
