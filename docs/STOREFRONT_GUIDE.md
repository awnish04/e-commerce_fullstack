# Store Front Guide - How to Access and Set Up

## Two Parts of Your Application

Your e-commerce app has **two distinct sections**:

### 1. 🔧 Admin Dashboard
- **URL**: `http://localhost:3000/[storeId]/...`
- **Example**: `http://localhost:3000/b7e7015a-40f3-4520-9a1a-cc34054e6874/billboards`
- **Purpose**: Manage your store (products, categories, billboards, orders)
- **Access**: Requires authentication

### 2. 🛍️ Store Front (Customer View)
- **URL**: `http://localhost:3000/`
- **Purpose**: What your customers see (products, cart, checkout)
- **Access**: Public (no login needed)

---

## How to Access the Store Front

### Step 1: Navigate to the Home Page
Open your browser and go to:
```
http://localhost:3000/
```

This is what your customers will see!

---

## What You'll See on the Store Front

### Home Page (`/`)
- **Billboard**: First billboard from your store (hero image)
- **Featured Products**: Products marked as "featured" in admin

### Category Pages (`/category/[categoryId]`)
- Browse products by category
- Filter by size and color
- View all products in that category

### Product Page (`/product/[productId]`)
- Individual product details
- Product images
- Add to cart button
- Related products

### Cart Page (`/cart`)
- Shopping cart items
- Checkout button

---

## Setting Up Your Store Front

### Step 1: Create a Billboard (Admin)
1. Go to `http://localhost:3000/[storeId]/billboards`
2. Click "Add New"
3. Upload an image (hero banner)
4. Add a label
5. Save

### Step 2: Create Categories (Admin)
1. Go to `http://localhost:3000/[storeId]/categories`
2. Click "Add New"
3. Select a billboard
4. Add category name (e.g., "Shirts", "Shoes")
5. Save

### Step 3: Create Sizes (Admin)
1. Go to `http://localhost:3000/[storeId]/sizes`
2. Add sizes (e.g., S, M, L, XL)
3. Save each one

### Step 4: Create Colors (Admin)
1. Go to `http://localhost:3000/[storeId]/colors`
2. Add colors with hex values (e.g., Black: #000000)
3. Save each one

### Step 5: Create Products (Admin)
1. Go to `http://localhost:3000/[storeId]/products`
2. Click "Add New"
3. Fill in:
   - Product name
   - Price
   - Category
   - Size
   - Color
   - Upload images
   - Mark as "Featured" to show on homepage
4. Save

### Step 6: View on Store Front
1. Open `http://localhost:3000/`
2. You should see:
   - Your billboard at the top
   - Featured products below
   - Navigation to categories

---

## Store Front Pages

### Available Routes:

```
/                          → Home (billboard + featured products)
/category/[categoryId]     → Category page with products
/product/[productId]       → Individual product page
/cart                      → Shopping cart
```

### Navigation:
The store front has a navbar with:
- Store name
- Category links
- Shopping cart icon

---

## Testing Your Store Front

### Quick Test Checklist:

1. ✅ **Home Page**
   ```
   http://localhost:3000/
   ```
   - Should show billboard (if you created one)
   - Should show featured products (if any marked as featured)

2. ✅ **Category Page**
   ```
   http://localhost:3000/category/[your-category-id]
   ```
   - Replace `[your-category-id]` with actual category ID
   - Should show products in that category
   - Has filters for size and color

3. ✅ **Product Page**
   ```
   http://localhost:3000/product/[your-product-id]
   ```
   - Shows product details
   - Image gallery
   - Add to cart button

---

## How to Get Category/Product IDs

### From Admin Dashboard:
1. Go to categories or products list
2. The URL shows the ID
3. Or hover over items - ID shown in URL

### From API:
1. Open browser console (F12)
2. Go to Network tab
3. Visit store front
4. Check API calls for IDs

---

## Troubleshooting

### "No products showing"
- ✅ Make sure you created products in admin
- ✅ Mark at least one as "Featured" for homepage
- ✅ Check that products are not "Archived"

### "No billboard showing"
- ✅ Create at least one billboard in admin
- ✅ The first billboard will display automatically

### "Categories not showing"
- ✅ Create categories in admin
- ✅ Link categories to billboards

### "Images not loading"
- ✅ Images are stored as base64 in database
- ✅ Check browser console for errors
- ✅ Verify database connection

---

## Store Front vs Admin Dashboard

| Feature | Admin Dashboard | Store Front |
|---------|----------------|-------------|
| **URL** | `/[storeId]/...` | `/` |
| **Purpose** | Manage store | Shop products |
| **Auth** | Required | Public |
| **Features** | CRUD operations | Browse & buy |
| **Users** | Store owners | Customers |

---

## Quick Start Flow

1. **Admin**: Create billboard → categories → sizes → colors → products
2. **Store Front**: Visit `/` to see your store
3. **Customer**: Browse → Add to cart → Checkout

---

## Example Store Setup

```bash
# 1. Admin Dashboard
http://localhost:3000/b7e7015a-40f3-4520-9a1a-cc34054e6874/billboards
→ Create "Summer Sale" billboard

http://localhost:3000/b7e7015a-40f3-4520-9a1a-cc34054e6874/categories
→ Create "T-Shirts" category

http://localhost:3000/b7e7015a-40f3-4520-9a1a-cc34054e6874/products
→ Create "Cool T-Shirt" product (mark as Featured)

# 2. Store Front
http://localhost:3000/
→ See "Summer Sale" billboard
→ See "Cool T-Shirt" in Featured Products
```

---

## Next Steps

1. ✅ Create your first billboard
2. ✅ Add some categories
3. ✅ Create sizes and colors
4. ✅ Add products (mark some as featured)
5. ✅ Visit `http://localhost:3000/` to see your store!

**Your store front is now ready to display products! 🎉**
