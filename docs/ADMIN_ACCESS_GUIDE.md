# Admin Dashboard Access Guide

## 🔐 How to Access the Admin Dashboard

### Quick Start

1. **Start the development server**
   ```bash
   pnpm dev
   ```

2. **Navigate to the sign-in page**
   ```
   http://localhost:3000/sign-in
   ```

3. **Sign up or sign in** with your credentials

4. **Access your store dashboard**
   ```
   http://localhost:3000/{storeId}
   ```

---

## Step-by-Step Guide

### Step 1: Create an Admin Account

#### Option A: Sign Up (New User)

1. Go to `http://localhost:3000/sign-up`
2. Fill in the registration form:
   - **Email:** your@email.com
   - **Password:** (minimum 8 characters)
3. Click "Sign Up"
4. You'll be redirected after successful registration

#### Option B: Sign In (Existing User)

1. Go to `http://localhost:3000/sign-in`
2. Enter your credentials:
   - **Email:** your@email.com
   - **Password:** your password
3. Click "Sign In"

### Step 2: Create Your First Store

After signing in, you'll be redirected to the root page (`/`).

**First Time User:**
- The store modal will automatically open
- Click "Create Store" or navigate to the modal
- Enter your store name (e.g., "My Store")
- Click "Create"

**The store modal is managed by:**
- Component: `components/admin/modals/store-modal.tsx`
- Hook: `hooks/use-store-modal.tsx`

### Step 3: Access the Dashboard

Once your store is created, you can access the admin dashboard at:

```
http://localhost:3000/{your-store-id}
```

**Example:**
```
http://localhost:3000/clx1234567890
```

---

## Dashboard Routes

Once you're in the admin dashboard, you can access:

| Route | Purpose |
|-------|---------|
| `/{storeId}` | Dashboard Overview (Revenue, Sales, Stock) |
| `/{storeId}/billboards` | Manage Billboards |
| `/{storeId}/categories` | Manage Categories |
| `/{storeId}/products` | Manage Products |
| `/{storeId}/orders` | View Orders |
| `/{storeId}/settings` | Store Settings |

---

## Route Structure

```
Authentication:
├── /sign-in              → Admin login
└── /sign-up              → Admin registration

Admin Dashboard (Protected):
└── /{storeId}/
    ├── /                 → Dashboard overview
    ├── /billboards       → Billboard management
    ├── /categories       → Category management
    ├── /products         → Product management
    ├── /orders           → Order management
    └── /settings         → Store settings

Public Store:
├── /                     → Store homepage
├── /category/{id}        → Category page
├── /product/{id}         → Product details
└── /cart                 → Shopping cart
```

---

## Creating Your First Admin User (Database Method)

If you need to create an admin user directly in the database:

### Using Prisma Studio

1. **Open Prisma Studio**
   ```bash
   pnpm prisma studio
   ```

2. **Navigate to the `User` table**

3. **Click "Add record"**

4. **Fill in the fields:**
   - `id`: (auto-generated UUID)
   - `email`: admin@example.com
   - `password`: (hashed password - see below)
   - `name`: Admin User (optional)
   - `createdAt`: (auto-generated)
   - `updatedAt`: (auto-generated)

### Hashing a Password

The password needs to be hashed using bcrypt. You can use this script:

```javascript
// scripts/hash-password.js
const bcrypt = require('bcryptjs');

const password = 'your-password-here';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Hashed password:', hashedPassword);
```

Run it:
```bash
node scripts/hash-password.js
```

---

## Authentication System

The project uses a custom authentication system located in:
- **Auth Logic:** `lib/auth/auth.ts`
- **Auth Provider:** `components/providers/auth-provider.tsx`
- **API Routes:**
  - `/api/auth/signup` - Registration
  - `/api/auth/signin` - Login
  - `/api/auth/signout` - Logout
  - `/api/auth/me` - Get current user

### Auth Features
- ✅ Secure password hashing (bcrypt)
- ✅ Session-based authentication
- ✅ Protected routes
- ✅ Automatic session cleanup

---

## Troubleshooting

### "Unauthorized" Error

**Problem:** Can't access admin routes  
**Solution:**
1. Make sure you're signed in
2. Check that your session is valid
3. Clear cookies and sign in again
4. Check the database for your user record

### Can't Find Store ID

**Problem:** Don't know your store ID  
**Solution:**
1. Check the browser URL after creating a store
2. Look in Prisma Studio under the `Store` table
3. Check the database directly:
   ```bash
   pnpm prisma studio
   ```

### Modal Not Opening

**Problem:** Store creation modal doesn't open  
**Solution:**
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page
4. Check `hooks/use-store-modal.tsx`

### Database Connection Issues

**Problem:** Can't connect to database  
**Solution:**
1. Check `.env` file has `DATABASE_URL`
2. Run `pnpm prisma generate`
3. Run `pnpm prisma db push`
4. Verify database is running

---

## Development Setup

### First Time Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="your-secret-key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
   STRIPE_SECRET_KEY="sk_..."
   ```

3. **Set up database**
   ```bash
   pnpm prisma db push
   pnpm prisma generate
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Access the app**
   ```
   http://localhost:3000
   ```

---

## Quick Access Links

When running locally (`pnpm dev`):

- **Store Homepage:** http://localhost:3000
- **Admin Sign In:** http://localhost:3000/sign-in
- **Admin Sign Up:** http://localhost:3000/sign-up
- **Prisma Studio:** Run `pnpm prisma studio`

---

## Security Notes

### Development
- Use strong passwords even in development
- Don't commit `.env` files
- Keep `AUTH_SECRET` secure

### Production
- Use environment-specific secrets
- Enable HTTPS
- Set up rate limiting
- Use strong password requirements
- Enable 2FA (future enhancement)

---

## Next Steps After Accessing Admin

1. **Configure Store Settings**
   - Go to `/{storeId}/settings`
   - Set store name
   - Configure options

2. **Create Billboard**
   - Go to `/{storeId}/billboards`
   - Add hero image/banner
   - Set label text

3. **Add Categories**
   - Go to `/{storeId}/categories`
   - Create product categories
   - Link to billboard

4. **Add Products**
   - Go to `/{storeId}/products`
   - Add product details
   - Upload images
   - Set pricing and stock

5. **View Orders**
   - Go to `/{storeId}/orders`
   - Track customer orders
   - Monitor sales

---

## Support

For more help:
- Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- Review [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- See [QUICK_FIXES.md](./QUICK_FIXES.md)

---

**Last Updated:** September 4, 2026
