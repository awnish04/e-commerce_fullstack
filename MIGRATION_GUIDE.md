# Database Migration Guide
## Single Store with Product Variant Architecture

This guide explains how to migrate from the multi-store architecture to a single clothing store with proper product variants.

---

## ⚠️ IMPORTANT - Before You Begin

**BACKUP YOUR DATABASE FIRST!**

```bash
# If using Neon, create a branch backup
# Or export your data
npx prisma db pull
npx prisma db seed --preview-feature
```

---

## Migration Overview

### What's Being Changed:

1. **Removed:**
   - `Store` model entirely
   - All `storeId` foreign keys
   - `price`, `size`, `color`, `stock` fields from Product
   - `Image` model (renamed to `ProductImage`)

2. **Added:**
   - `Color` model with hex code support
   - `Size` model with type classification
   - `ProductVariant` model (core of new architecture)
   - `ProductImage` model with variant support
   - Category hierarchy (parentId)
   - Order enums and enhanced fields
   - UserRole enum

3. **Modified:**
   - Product now only contains base info (name, description, category)
   - Order now has proper money fields (Decimal), status enum, userId
   - OrderItem now references both Product AND ProductVariant
   - Category supports nested hierarchies

---

## Step-by-Step Migration Process

### Phase 1: Prepare Environment

1. **Set DATABASE_URL in .env:**
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

2. **Temporarily update schema.prisma datasource:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")  // Add this line temporarily
   }
   ```

### Phase 2: Create Migration

```bash
# Create the migration SQL file
npx prisma migrate dev --name single_store_variant_architecture --create-only
```

This will create a migration file in `prisma/migrations/`. You'll need to edit it.

### Phase 3: Customize Migration SQL

The auto-generated migration will fail because it can't automatically:
- Migrate existing product data to variants
- Convert Float prices to Decimal
- Handle the Store removal

Edit the generated migration file to include:

#### Step 1: Create New Tables First

```sql
-- Create enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER', 'STAFF');
CREATE TYPE "SizeType" AS ENUM ('CLOTHING', 'SHOE', 'WAIST', 'CUSTOM');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- Create Color table
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- Create Size table
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SizeType" NOT NULL DEFAULT 'CLOTHING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Size_name_type_key" ON "Size"("name", "type");

-- Create ProductVariant table
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "colorId" TEXT,
    "sizeId" TEXT,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");
CREATE UNIQUE INDEX "ProductVariant_productId_colorId_sizeId_key" ON "ProductVariant"("productId", "colorId", "sizeId");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "ProductVariant_colorId_idx" ON "ProductVariant"("colorId");
CREATE INDEX "ProductVariant_sizeId_idx" ON "ProductVariant"("sizeId");
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");
CREATE INDEX "ProductVariant_stock_idx" ON "ProductVariant"("stock");
CREATE INDEX "ProductVariant_isActive_idx" ON "ProductVariant"("isActive");
```

#### Step 2: Migrate Existing Data

```sql
-- Insert default colors from existing products
INSERT INTO "Color" ("id", "name", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    DISTINCT TRIM("color"),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Product"
WHERE "color" IS NOT NULL AND "color" != ''
ON CONFLICT DO NOTHING;

-- Insert default sizes from existing products
INSERT INTO "Size" ("id", "name", "type", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid()::text,
    DISTINCT TRIM("size"),
    'CLOTHING',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Product"
WHERE "size" IS NOT NULL AND "size" != ''
ON CONFLICT DO NOTHING;

-- Create ProductVariants from existing Products
INSERT INTO "ProductVariant" (
    "id",
    "productId",
    "colorId",
    "sizeId",
    "sku",
    "price",
    "stock",
    "isActive",
    "createdAt",
    "updatedAt"
)
SELECT 
    gen_random_uuid()::text,
    p."id",
    c."id",
    s."id",
    CONCAT('SKU-', SUBSTRING(p."id", 1, 8), '-', 
           COALESCE(SUBSTRING(p."color", 1, 3), 'DEF'), '-',
           COALESCE(SUBSTRING(p."size", 1, 2), 'OS')),
    p."price"::decimal(10,2),
    COALESCE(p."stock", 0),
    NOT p."isArchived",
    p."createdAt",
    p."updatedAt"
FROM "Product" p
LEFT JOIN "Color" c ON TRIM(p."color") = c."name"
LEFT JOIN "Size" s ON TRIM(p."size") = s."name" AND s."type" = 'CLOTHING';
```

#### Step 3: Rename and Update Product Table

```sql
-- Add new fields to Product
ALTER TABLE "Product" ADD COLUMN "slug" TEXT;

-- Generate slugs from existing names
UPDATE "Product" 
SET "slug" = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'),
        '^-|-$', '', 'g'
    )
) || '-' || SUBSTRING("id", 1, 8);

-- Make slug unique and required
ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- Remove old fields from Product
ALTER TABLE "Product" DROP COLUMN "storeId";
ALTER TABLE "Product" DROP COLUMN "price";
ALTER TABLE "Product" DROP COLUMN "size";
ALTER TABLE "Product" DROP COLUMN "color";
ALTER TABLE "Product" DROP COLUMN "stock";

-- Update Product foreign key to Restrict instead of Cascade
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

#### Step 4: Rename Image to ProductImage

```sql
-- Rename Image table to ProductImage
ALTER TABLE "Image" RENAME TO "ProductImage";

-- Add new fields
ALTER TABLE "ProductImage" ADD COLUMN "variantId" TEXT;
ALTER TABLE "ProductImage" ADD COLUMN "altText" TEXT;
ALTER TABLE "ProductImage" ADD COLUMN "sortOrder" INTEGER DEFAULT 0;

-- Add foreign key for variantId
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "ProductImage_variantId_idx" ON "ProductImage"("variantId");
```

#### Step 5: Update Category Table

```sql
-- Remove storeId from Category
ALTER TABLE "Category" DROP CONSTRAINT "Category_storeId_fkey";
ALTER TABLE "Category" DROP COLUMN "storeId";

-- Add slug and parentId for hierarchy
ALTER TABLE "Category" ADD COLUMN "slug" TEXT;
ALTER TABLE "Category" ADD COLUMN "parentId" TEXT;

-- Generate slugs
UPDATE "Category" 
SET "slug" = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'),
        '^-|-$', '', 'g'
    )
);

ALTER TABLE "Category" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- Make billboardId optional
ALTER TABLE "Category" ALTER COLUMN "billboardId" DROP NOT NULL;

-- Add parent relationship
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
```

#### Step 6: Update Billboard Table

```sql
-- Remove storeId from Billboard
ALTER TABLE "Billboard" DROP CONSTRAINT "Billboard_storeId_fkey";
ALTER TABLE "Billboard" DROP COLUMN "storeId";

-- Add isActive field
ALTER TABLE "Billboard" ADD COLUMN "isActive" BOOLEAN DEFAULT true;
```

#### Step 7: Update Order and OrderItem

```sql
-- Add new fields to Order
ALTER TABLE "Order" ADD COLUMN "userId" TEXT;
ALTER TABLE "Order" ADD COLUMN "status" "OrderStatus" DEFAULT 'PENDING';
ALTER TABLE "Order" ADD COLUMN "subtotal" DECIMAL(10,2);
ALTER TABLE "Order" ADD COLUMN "shippingFee" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "discount" DECIMAL(10,2) DEFAULT 0;

-- Convert totalPrice from Float to Decimal
ALTER TABLE "Order" ALTER COLUMN "totalPrice" TYPE DECIMAL(10,2);

-- Set default values for existing orders
UPDATE "Order" SET "subtotal" = "totalPrice", "phone" = '' WHERE "phone" IS NULL;
UPDATE "Order" SET "address" = '' WHERE "address" IS NULL;

-- Make phone and address required
ALTER TABLE "Order" ALTER COLUMN "phone" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "address" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "subtotal" SET NOT NULL;

-- Remove storeId
ALTER TABLE "Order" DROP CONSTRAINT "Order_storeId_fkey";
ALTER TABLE "Order" DROP COLUMN "storeId";

-- Add userId foreign key
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- Update OrderItem
ALTER TABLE "OrderItem" ADD COLUMN "variantId" TEXT;

-- Link existing order items to a variant (use first variant of each product)
UPDATE "OrderItem" oi
SET "variantId" = (
    SELECT pv."id"
    FROM "ProductVariant" pv
    WHERE pv."productId" = oi."productId"
    ORDER BY pv."createdAt" ASC
    LIMIT 1
);

-- Make variantId required
ALTER TABLE "OrderItem" ALTER COLUMN "variantId" SET NOT NULL;

-- Convert price from Float to Decimal
ALTER TABLE "OrderItem" ALTER COLUMN "price" TYPE DECIMAL(10,2);

-- Add foreign key for variantId
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update product foreign key to Restrict
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- Remove default from quantity
ALTER TABLE "OrderItem" ALTER COLUMN "quantity" DROP DEFAULT;
```

#### Step 8: Update User Table

```sql
-- Add role field
ALTER TABLE "User" ADD COLUMN "role" "UserRole" DEFAULT 'CUSTOMER';

-- Make passwordHash optional (for OAuth users in future)
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- Remove stores relation (handled by dropping Store table)
CREATE INDEX "User_email_idx" ON "User"("email");
```

#### Step 9: Drop Store Table

```sql
-- Finally, drop the Store table
DROP TABLE "Store" CASCADE;
```

#### Step 10: Add Foreign Key Constraints

```sql
-- Add ProductVariant foreign keys
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_colorId_fkey"
    FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_sizeId_fkey"
    FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

### Phase 4: Apply Migration

```bash
# Apply the migration
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Phase 5: Verify Migration

```bash
# Check the database
npx prisma studio

# Run data verification script
npm run verify-migration
```

---

## Post-Migration Checklist

- [ ] All Products have at least one ProductVariant
- [ ] All ProductVariants have valid SKUs
- [ ] All Colors are properly migrated
- [ ] All Sizes are properly migrated
- [ ] All OrderItems reference valid ProductVariants
- [ ] No references to Store or storeId remain
- [ ] Category slugs are unique
- [ ] Product slugs are unique
- [ ] All money fields use Decimal
- [ ] All indexes are created

---

## Rollback Plan

If something goes wrong:

1. **Restore from backup:**
   ```bash
   # If using Neon branch
   neon branches restore <branch-name>
   
   # Or restore from SQL dump
   psql $DATABASE_URL < backup.sql
   ```

2. **Revert Prisma schema:**
   ```bash
   git checkout HEAD~1 prisma/schema.prisma
   npx prisma generate
   ```

---

## Common Issues

### Issue: Duplicate SKUs
**Solution:** SKUs are generated from product ID + color + size. If duplicates exist, manually update them:
```sql
UPDATE "ProductVariant" 
SET "sku" = "sku" || '-' || gen_random_uuid()::text
WHERE "id" IN (SELECT "id" FROM duplicate_skus);
```

### Issue: Products without variants
**Solution:** Create a default variant for products with no size/color:
```sql
INSERT INTO "ProductVariant" (...)
SELECT ... FROM "Product" p
WHERE NOT EXISTS (SELECT 1 FROM "ProductVariant" WHERE "productId" = p."id");
```

### Issue: Orders without variants
**Solution:** Already handled in migration - links to first variant of each product.

---

## Next Steps

After migration is complete:

1. Update application code (Phase 4-7 of main migration)
2. Update API routes to remove storeId
3. Update frontend to use variants
4. Test thoroughly in development
5. Deploy to production with maintenance window

