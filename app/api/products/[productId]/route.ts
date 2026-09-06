import { getCurrentUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import prismadb from "@/lib/db/prismadb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
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
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
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
    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // Update product basic info
    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        description: description || null,
        categoryId,
        isFeatured: isFeatured || false,
        isArchived: isArchived || false,
      },
    });

    // Handle images update - delete old, create new
    if (images) {
      await prismadb.productImage.deleteMany({
        where: {
          productId,
          variantId: null, // Only delete product-level images
        },
      });

      await prismadb.productImage.createMany({
        data: images.map(
          (image: { url: string; altText?: string; sortOrder?: number }) => ({
            productId,
            url: image.url,
            altText: image.altText || null,
            sortOrder: image.sortOrder || 0,
          }),
        ),
      });
    }

    // Handle variants update if provided
    if (variants && Array.isArray(variants)) {
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

      // Get existing variant IDs
      const existingVariants = await prismadb.productVariant.findMany({
        where: { productId },
        select: { id: true },
      });

      const existingVariantIds = existingVariants.map((v) => v.id);
      const updatedVariantIds = normalizedVariants
        .filter((v) => v.id)
        .map((v) => v.id);

      // Delete variants that are no longer present
      const variantsToDelete = existingVariantIds.filter(
        (id) => !updatedVariantIds.includes(id),
      );
      if (variantsToDelete.length > 0) {
        await prismadb.productVariant.deleteMany({
          where: {
            id: { in: variantsToDelete },
          },
        });
      }

      // Update or create variants
      for (const variant of normalizedVariants) {
        const variantData = {
          productId,
          colorId: variant.colorId || null,
          sizeId: variant.sizeId || null,
          sku: variant.sku,
          price: parseFloat(variant.price),
          stock: parseInt(variant.stock) || 0,
          isActive: variant.isActive !== false,
        };

        if (variant.id) {
          // Update existing variant
          await prismadb.productVariant.update({
            where: { id: variant.id },
            data: variantData,
          });
        } else {
          // Create new variant
          await prismadb.productVariant.create({
            data: variantData,
          });
        }
      }
    }

    // Fetch updated product with all relations
    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        variants: {
          include: {
            color: true,
            size: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // Check if product exists
    const product = await prismadb.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Delete product (cascade will handle variants and images)
    await prismadb.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
