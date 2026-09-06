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
    const { name, hexCode } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        hexCode: hexCode || null,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const colors = await prismadb.color.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
