# Quick Fixes for Remaining Build Errors

## Run These Commands to Fix Build Errors

### 1. Fix use-mobile imports in dashboard components

```bash
# Fix chart-area-interactive.tsx
sed -i '' 's/@\/components\/hooks\/use-mobile/@\/hooks\/use-mobile/g' components/chart-area-interactive.tsx

# Fix data-table.tsx  
sed -i '' 's/@\/components\/hooks\/use-mobile/@\/hooks\/use-mobile/g' components/data-table.tsx
```

### 2. If Store model needs userId (optional)

If you want to keep multi-user support, add back to schema.prisma:

```prisma
model Store {
  id         String      @id @default(uuid())
  name       String
  userId     String?     // Add this line if needed
  billboard  Billboard?
  categories Category[]
  products   Product[]
  orders     Order[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

Then run:
```bash
pnpm prisma generate
pnpm prisma db push
```

### 3. Test the Application

```bash
# Clear cache
rm -rf .next

# Start dev server
pnpm run dev
```

### 4. Create Your First Store

1. Visit http://localhost:3000
2. Sign up for an admin account
3. Create your first store
4. Add a billboard
5. Create categories
6. Add products with:
   - Name
   - Description
   - Images
   - Price
   - Size (e.g., "M", "42", "Large")
   - Color (e.g., "Red", "Black", "#FF0000")
   - Stock (number of items available)

### 5. View the Store

1. Visit the store homepage
2. Browse categories
3. View product details
4. Add items to cart
5. Test checkout

## Quick Schema Reference

### Product Fields
- `name`: string (required)
- `description`: string | null (optional)
- `price`: float (required)
- `categoryId`: string (required, relation)
- `size`: string (optional, e.g., "M", "L", "XL")
- `color`: string (optional, e.g., "Red", "Blue")
- `stock`: int (default: 0)
- `isFeatured`: boolean (default: false)
- `isArchived`: boolean (default: false)
- `images`: Image[] (required, at least 1)

### Example Product Creation

```typescript
// Size examples
"S", "M", "L", "XL", "XXL"
"38", "40", "42", "44"
"Small", "Medium", "Large"
"One Size"

// Color examples
"Black", "White", "Red", "Blue"
"Navy Blue", "Forest Green"
"#000000", "#FFFFFF", "#FF0000"
"Multi-color"

// Stock examples
0 = Out of stock
1-10 = Low stock
10+ = In stock
```

## Verification Checklist

- [ ] Dev server starts without errors
- [ ] Can sign up/sign in
- [ ] Can create a store
- [ ] Can add billboard
- [ ] Can create categories
- [ ] Can create products with size/color/stock
- [ ] Products display on store homepage
- [ ] Can view product details
- [ ] Size and color show as text
- [ ] Stock availability badge shows
- [ ] Can add to cart
- [ ] Cart shows size/color correctly
- [ ] Admin dashboard sidebar works
- [ ] Store switcher works
- [ ] Breadcrumbs work
- [ ] Product table shows stock badge

## Common Issues

### "No store found" Error
- **Cause**: Database has no stores yet
- **Fix**: Create your first store through the admin panel

### Images Not Uploading
- **Cause**: Using base64 storage (large images may fail)
- **Fix**: Use smaller images or implement Cloudinary/S3

### Database Connection Timeout
- **Cause**: Neon DB auto-suspend (free tier)
- **Fix**: Wake database by running a query, or use pooler connection

### TypeScript Errors
- **Cause**: Schema changes not reflected
- **Fix**: Run `pnpm prisma generate`

## Need Help?

1. Check `STRUCTURE.md` for project organization
2. Check `REDESIGN_SUMMARY.md` for what was changed
3. Check Prisma schema for current data model
4. Check console for specific error messages

## Production Deployment

Before deploying:

1. Fix all TypeScript errors
2. Test all features
3. Update environment variables
4. Run `pnpm run build` successfully
5. Set up proper image storage (Cloudinary/S3)
6. Configure production database
7. Set up proper authentication
8. Test checkout flow thoroughly

---

Last Updated: 2026-09-05
