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

    const {
      name,
      slug,
      description,
      categoryId,
      images,
      variants,
      isFeatured,
      isArchived,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!variants || !variants.length) {
      return new NextResponse("At least one variant is required", {
        status: 400,
      });
    }

    const normalizedVariants = await Promise.all(
      variants.map(async (variant: any) => {
        const color = variant.colorId
          ? { id: variant.colorId }
          : variant.colorName
            ? await prismadb.color.upsert({
                where: { name: variant.colorName.trim() },
                update: {},
                create: { name: variant.colorName.trim() },
              })
            : null;
        const size = variant.sizeId
          ? { id: variant.sizeId }
          : variant.sizeName
            ? await prismadb.size.upsert({
                where: {
                  name_type: {
                    name: variant.sizeName.trim(),
                    type: "CLOTHING",
                  },
                },
                update: {},
                create: { name: variant.sizeName.trim(), type: "CLOTHING" },
              })
            : null;

        return {
          ...variant,
          colorId: color?.id ?? null,
          sizeId: size?.id ?? null,
        };
      }),
    );

    // Validate variants
    for (const variant of normalizedVariants) {
      if (!variant.sku) {
        return new NextResponse("SKU is required for all variants", {
          status: 400,
        });
      }
      if (!variant.price || parseFloat(variant.price) <= 0) {
        return new NextResponse("Valid price is required for all variants", {
          status: 400,
        });
      }
    }

    const product = await prismadb.product.create({
      data: {
        name,
        slug,
        description: description || null,
        categoryId,
        isFeatured: isFeatured || false,
        isArchived: isArchived || false,
        images: {
          createMany: {
            data:
              images?.map(
                (image: {
                  url: string;
                  altText?: string;
                  sortOrder?: number;
                }) => ({
                  url: image.url,
                  altText: image.altText || null,
                  sortOrder: image.sortOrder || 0,
                }),
              ) || [],
          },
        },
        variants: {
          createMany: {
            data: normalizedVariants.map((variant: any) => ({
              colorId: variant.colorId || null,
              sizeId: variant.sizeId || null,
              sku: variant.sku,
              price: parseFloat(variant.price),
              stock: parseInt(variant.stock) || 0,
              isActive: variant.isActive !== false,
            })),
          },
        },
      },
      include: {
        category: true,
        images: true,
        variants: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const name = searchParams.get("name") || undefined;

    const products = await prismadb.product.findMany({
      where: {
        categoryId,
        isFeatured: isFeatured === "true" ? true : undefined,
        isArchived: false,
        name: name
          ? {
              contains: name,
              mode: "insensitive",
            }
          : undefined,
        variants:
          colorId || sizeId
            ? {
                some: {
                  colorId: colorId || undefined,
                  sizeId: sizeId || undefined,
                  isActive: true,
                  stock: {
                    gt: 0,
                  },
                },
              }
            : undefined,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        category: {
          include: {
            billboard: true,
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          include: {
            color: true,
            size: true,
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
