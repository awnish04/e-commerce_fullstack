# Backend Migration Status

## Phase 4: Backend Updates - IN PROGRESS

### ✅ Completed

#### 1. TypeScript Types Updated
- **File**: `shared/types/index.ts`
- Added: `Color`, `Size`, `ProductVariant`, `ProductImage`, `CartItem`, `Order`, `OrderItem`
- Updated: `Product` (now includes variants array), `Category` (hierarchy support), `Billboard`
- Removed: Old `Image` interface, `size`/`color`/`stock`/`price` from Product

#### 2. Store Utils Removed
- **File**: `lib/store-utils.ts` - DELETED
- Removed `getDefaultStoreId()` function (no longer needed)

#### 3. New API Routes Created (without storeId)
- ✅ `/api/products/route.ts` - List/Create products with variants
- ✅ `/api/products/[productId]/route.ts` - Get/Update/Delete individual products
- ✅ `/api/categories/route.ts` - List/Create categories with hierarchy
- ✅ `/api/colors/route.ts` - List/Create colors
- ✅ `/api/colors/[colorId]/route.ts` - Get/Update/Delete colors
- ✅ `/api/sizes/route.ts` - List/Create sizes with type
- ✅ `/api/checkout/route.ts` - Checkout with variant support and stock validation
- ✅ `/api/webhook/route.ts` - Updated to reduce variant stock (not archive products)

#### 4. Frontend Actions Updated
- ✅ `lib/actions/get-products.tsx` - Removed storeId, added color/size filters

### 🔄 Still TODO

#### API Routes to Update/Remove
- [ ] Update all remaining `/api/[storeId]/*` routes
- [ ] `/api/[storeId]/billboards/` → `/api/billboards/`
- [ ] `/api/[storeId]/categories/[categoryId]/` → `/api/categories/[categoryId]/`
- [ ] `/api/[storeId]/orders/` → `/api/orders/`
- [ ] Remove `/api/stores/` entirely
- [ ] Create `/api/sizes/[sizeId]/route.ts`
- [ ] Create `/api/categories/[categoryId]/route.ts`
- [ ] Create `/api/billboards/route.ts` and `/api/billboards/[billboardId]/route.ts`
- [ ] Create `/api/orders/route.ts` and `/api/orders/[orderId]/route.ts`

#### Frontend Actions to Update
- [ ] `lib/actions/get-product.tsx` - Remove storeId
- [ ] `lib/actions/get-category.tsx` - Remove storeId
- [ ] `lib/actions/get-categories.tsx` - Remove storeId
- [ ] `lib/actions/get-billboard.tsx` - Remove storeId
- [ ] `lib/actions/get-featured-billboard.tsx` - Remove storeId
- [ ] `lib/actions/admin/get-*` - Remove storeId from all admin actions

#### Search All Remaining storeId References
```bash
# Find all remaining storeId references
grep -r "storeId" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" .
grep -r "getDefaultStoreId" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" .
grep -r "\[storeId\]" --include="*.ts" --include="*.tsx" --exclude-dir="node_modules" .
```

### Key Changes Made

#### Product API
- **POST /api/products**: Now accepts `variants` array, creates Product with ProductVariants
- **GET /api/products**: Filters by `categoryId`, `colorId`, `sizeId`, `isFeatured`, `name`
- Returns products with full variant data including color/size/images
- **PATCH /api/products/[productId]**: Updates product and variants
- **DELETE /api/products/[productId]**: Deletes product (cascade removes variants)

#### Checkout API
- Validates `cartItems` with `variantId` and `quantity`
- Checks variant stock availability before creating order
- Creates OrderItem with both `productId` AND `variantId`
- Snapshots price at time of purchase
- Calculates `subtotal`, `shippingFee`, `discount`, `totalPrice`

#### Webhook
- Updates Order status to "CONFIRMED" on payment
- Decrements variant stock (not product stock)
- Marks variants as inactive when stock reaches zero
- Does NOT archive products anymore

#### Color/Size APIs
- Full CRUD operations for managing colors and sizes
- Colors support optional `hexCode`
- Sizes support `type` (CLOTHING, SHOE, WAIST, CUSTOM)

### Important Notes

1. **NEXT_PUBLIC_API_URL**: Update `.env` to remove `/<storeId>` from URL
   ```env
   # OLD
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/<your-store-id>
   
   # NEW
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

2. **Admin Authorization**: All admin routes now check `user.role === "ADMIN"`

3. **Money Fields**: All price calculations use Decimal type

4. **Stock Management**: Stock is tracked per variant, NOT per product

5. **Cart Structure**: Must now include `variantId` in cart items

### Testing Checklist

- [ ] Create product with multiple variants
- [ ] Update product and variants
- [ ] Delete product (verify cascades)
- [ ] Filter products by color
- [ ] Filter products by size
- [ ] Filter products by category
- [ ] Add to cart with specific variant
- [ ] Checkout with variant stock validation
- [ ] Verify stock decrements after payment
- [ ] Verify price snapshots in orders
- [ ] Test variant activation/deactivation
- [ ] Test color CRUD operations
- [ ] Test size CRUD operations with types

