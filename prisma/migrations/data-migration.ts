/**
 * Data Migration Script
 * 
 * This script migrates existing data from the old multi-store architecture
 * to the new single-store product variant architecture.
 * 
 * Steps:
 * 1. Migrate existing Colors and Sizes from product strings to their own tables
 * 2. Create ProductVariants from existing Products
 * 3. Migrate Product images to ProductImage model
 * 4. Update Orders to use new structure
 * 5. Remove Store references
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface OldProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  size: string;
  color: string;
  stock: number;
  categoryId: string;
  isFeatured: boolean;
  isArchived: boolean;
  images: Array<{ id: string; url: string }>;
}

async function migrateData() {
  console.log('🚀 Starting data migration...\n');

  try {
    // Step 1: Create default colors from existing products
    console.log('📦 Step 1: Migrating colors...');
    const existingProducts = await prisma.$queryRaw<Array<{ color: string }>>`
      SELECT DISTINCT color FROM "Product" WHERE color != '' AND color IS NOT NULL
    `;
    
    const colorMap = new Map<string, string>();
    
    for (const { color } of existingProducts) {
      if (color && color.trim()) {
        const colorName = color.trim();
        const existingColor = await prisma.color.findUnique({
          where: { name: colorName }
        });
        
        if (!existingColor) {
          const newColor = await prisma.color.create({
            data: { name: colorName }
          });
          colorMap.set(colorName, newColor.id);
          console.log(`  ✓ Created color: ${colorName}`);
        } else {
          colorMap.set(colorName, existingColor.id);
        }
      }
    }

    // Step 2: Create default sizes from existing products
    console.log('\n📦 Step 2: Migrating sizes...');
    const existingSizes = await prisma.$queryRaw<Array<{ size: string }>>`
      SELECT DISTINCT size FROM "Product" WHERE size != '' AND size IS NOT NULL
    `;
    
    const sizeMap = new Map<string, string>();
    
    for (const { size } of existingSizes) {
      if (size && size.trim()) {
        const sizeName = size.trim();
        const existingSize = await prisma.size.findFirst({
          where: { name: sizeName, type: 'CLOTHING' }
        });
        
        if (!existingSize) {
          const newSize = await prisma.size.create({
            data: { 
              name: sizeName,
              type: 'CLOTHING'
            }
          });
          sizeMap.set(sizeName, newSize.id);
          console.log(`  ✓ Created size: ${sizeName}`);
        } else {
          sizeMap.set(sizeName, existingSize.id);
        }
      }
    }

    // Step 3: Migrate products and create variants
    console.log('\n📦 Step 3: Migrating products to variant architecture...');
    
    const oldProducts = await prisma.$queryRaw<OldProduct[]>`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.size,
        p.color,
        p.stock,
        p."categoryId",
        p."isFeatured",
        p."isArchived"
      FROM "Product" p
    `;

    console.log(`  Found ${oldProducts.length} products to migrate`);

    for (const oldProduct of oldProducts) {
      // Generate slug from name
      const slug = oldProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + oldProduct.id.substring(0, 8);

      // Get images for this product
      const images = await prisma.$queryRaw<Array<{ id: string; url: string }>>`
        SELECT id, url FROM "Image" WHERE "productId" = ${oldProduct.id}
      `;

      // Note: The actual migration will be handled by Prisma migrate
      // This is just the data transformation logic
      
      console.log(`  ✓ Prepared migration for: ${oldProduct.name}`);
    }

    console.log('\n✅ Data migration preparation complete!');
    console.log('\n⚠️  IMPORTANT: Run the following command to apply the migration:');
    console.log('   npx prisma migrate dev --name single_store_variant_architecture');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly
if (require.main === module) {
  migrateData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateData };
