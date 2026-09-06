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
    const { name, type } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }

    const size = await prismadb.size.create({
      data: {
        name,
        type,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const sizes = await prismadb.size.findMany({
      where: {
        type: type as any || undefined,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.error("[SIZES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
