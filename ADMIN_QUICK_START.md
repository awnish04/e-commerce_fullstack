# 🚀 Admin Dashboard - Quick Start

## How to Access Admin Dashboard

### Step 1: Sign In
Go to: **http://localhost:3000/sign-in**

### Step 2: After Sign In
You'll automatically be redirected to: **http://localhost:3000/admin**

### Step 3: Create Your Store
- A modal will open automatically
- Enter your store name
- Click "Create"

### Step 4: Access Dashboard
After creating a store, you'll be redirected to:  
**http://localhost:3000/{your-store-id}**

---

## URL Structure

```
Authentication:
├─ /sign-in          → Login page
└─ /sign-up          → Register account

Admin Pages:
├─ /admin            → Store setup (redirects to first store or opens modal)
└─ /{storeId}/       → Your admin dashboard
   ├─ /              → Overview (revenue, sales, stock)
   ├─ /billboards    → Manage billboards
   ├─ /categories    → Manage categories
   ├─ /products      → Manage products
   ├─ /orders        → View orders
   └─ /settings      → Store settings

Store (Public):
├─ /                 → Store homepage
├─ /category/{id}    → Category page
├─ /product/{id}     → Product page
└─ /cart             → Shopping cart
```

---

## Quick Access

When signed in:
- **Admin Setup:** http://localhost:3000/admin
- **Dashboard:** http://localhost:3000/{storeId}
- **Store View:** http://localhost:3000/

---

## Troubleshooting

### Problem: Redirected to store (/) after sign-in
**Solution:** Navigate manually to http://localhost:3000/admin

### Problem: Can't find store ID
**Solution:** 
1. Go to http://localhost:3000/admin
2. Look at URL after redirect: `/{this-is-your-store-id}`
3. Or use Prisma Studio: `pnpm prisma studio`

### Problem: Modal doesn't open
**Solution:**
1. Clear localStorage: Open browser console and run `localStorage.clear()`
2. Refresh page
3. Go to http://localhost:3000/admin

---

## Development Commands

```bash
# Start dev server
pnpm dev

# View database
pnpm prisma studio

# Build for production
pnpm run build
```

---

**Need more help?** Check `docs/ADMIN_ACCESS_GUIDE.md` for detailed instructions.
