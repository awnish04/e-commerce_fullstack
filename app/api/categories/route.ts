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

    const { name, slug, billboardId, parentId } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug is required", { status: 400 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        slug,
        billboardId: billboardId || null,
        parentId: parentId || null,
      },
      include: {
        billboard: true,
        parent: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");
    const includeChildren = searchParams.get("includeChildren") === "true";

    const categories = await prismadb.category.findMany({
      where: {
        parentId: parentId === "null" ? null : parentId || undefined,
      },
      include: {
        billboard: true,
        parent: true,
        children: includeChildren,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
