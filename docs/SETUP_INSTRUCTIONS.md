# 🚀 Setup Instructions

## ⚠️ Important: First-Time Setup Required

Before you can view the store frontend, you need to **create a store in the admin panel first**.

## Step-by-Step Setup:

### 1. Start the Development Server
```bash
cd /Users/awnishmehta/Desktop/ecommerce/ecommerce-unified
pnpm run dev
```

### 2. Create Your First Store
1. Visit: **http://localhost:3000**
2. You'll be redirected to create a store
3. Enter a store name (e.g., "Nivest Store")
4. Click "Create"

### 3. Set Up Store Content

Once your store is created, add:

#### A. **Create a Billboard** (for the homepage hero)
1. Go to: **Billboards** in the sidebar
2. Click "Add New"
3. Upload an image
4. Add a label (e.g., "BUILT FOR THE BOLD")
5. Click "Save"

#### B. **Create Categories**
1. Go to: **Categories**
2. Click "Add New"
3. Add category name (e.g., "Shoes", "Apparel")
4. Select a billboard
5. Click "Save"

#### C. **Create Sizes**
1. Go to: **Sizes**
2. Add sizes (e.g., "S", "M", "L", "XL" or "7", "8", "9", "10")

#### D. **Create Colors**
1. Go to: **Colors**
2. Add colors with hex values (e.g., "Black #000000", "White #FFFFFF")

#### E. **Create Products**
1. Go to: **Products**
2. Click "Add New"
3. Fill in:
   - Name (e.g., "Athletic Running Shoe")
   - Price (e.g., "120")
   - Category
   - Size
   - Color
   - Upload images (at least 1)
   - Check "Featured" to show on homepage
4. Click "Save"

### 4. View the Store
Once you have:
- ✅ At least 1 store created
- ✅ At least 1 billboard (optional but recommended)
- ✅ At least 1 product marked as "Featured"

Visit: **http://localhost:3000** (store frontend)

---

## 🔧 Troubleshooting

### Error: "PrismaClient was instantiated without any options"
**Solution**: Make sure your `.env` file has:
```env
DATABASE_URL=postgresql://...
```

### Error: "Store not found" or blank page
**Solution**: Create a store first via the admin panel (step 2 above)

### Error: No products showing
**Solution**: 
1. Make sure products are marked as "Featured"
2. Make sure products have images uploaded
3. Check that products are not archived

### Categories not showing in navbar
**Solution**: 
1. Create at least one category in the admin panel
2. Refresh the page

---

## 📁 Database Structure

Your database should have:
```
Store (1) → Must exist first!
  ├── Billboards (many)
  ├── Categories (many) → requires Billboard
  ├── Sizes (many)
  ├── Colors (many)
  └── Products (many) → requires Category, Size, Color
      └── Images (many)
```

---

## 🎨 Recommended First Products

For the best demo experience, create:

1. **3-5 Featured Products** with:
   - High-quality images
   - Varied prices ($50-$200)
   - Different categories
   - Different sizes and colors

2. **At least 1 Billboard** with:
   - Eye-catching image
   - Bold text label
   - Aspirational messaging

3. **3-4 Categories** like:
   - Running Shoes
   - Training Shoes
   - Casual Wear
   - Accessories

---

## ✅ Verification Checklist

Before testing the store, verify:
- [ ] Dev server is running (`pnpm run dev`)
- [ ] Database connection is working (no Prisma errors)
- [ ] At least 1 store exists
- [ ] At least 1 billboard exists
- [ ] At least 3 categories exist
- [ ] At least 1 featured product exists
- [ ] Products have images uploaded
- [ ] Products have prices set

---

## 🎉 Once Setup is Complete

You can enjoy:
- ✨ Modern animated navbar
- 🖼️ Hero billboard section
- 🛍️ Featured products grid
- 🔍 Working search
- 🛒 Full cart functionality
- 📱 Responsive design

---

## 📞 Need Help?

If you encounter issues:
1. Check the terminal for error messages
2. Verify `.env` file has `DATABASE_URL`
3. Run `pnpm prisma generate`
4. Restart the dev server
5. Clear browser cache

---

**Happy Selling! 🚀**
