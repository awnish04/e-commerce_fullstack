# Migration Guide: MongoDB + Clerk → NeonDB + JWT Auth

This document describes the completed migration from MongoDB with Clerk authentication to NeonDB (PostgreSQL) with custom JWT-based authentication.

## ✅ Completed Changes

### 1. Database Migration (MongoDB → PostgreSQL/NeonDB)

**Prisma Schema Updates:**
- Changed provider from `mongodb` to `postgresql`
- Removed all `@map("_id")` MongoDB-specific mappings
- Added `User` and `Session` models for JWT authentication
- Added proper `@@index` directives on all foreign keys
- Added `onDelete: Cascade` to maintain referential integrity
- Added `directUrl` for Neon connection pooling support

**New Models:**
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  passwordHash  String
  stores        Store[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Authentication System (Clerk → Custom JWT)

**New Files Created:**
- `lib/auth.ts` - JWT authentication utilities
- `providers/auth-provider.tsx` - Client-side auth context
- `app/api/auth/signin/route.ts` - Sign in endpoint
- `app/api/auth/signup/route.ts` - Sign up endpoint  
- `app/api/auth/signout/route.ts` - Sign out endpoint
- `app/api/auth/me/route.ts` - Get current user endpoint

**Key Features:**
- JWT tokens with 7-day expiration
- Secure HTTP-only cookies
- Password hashing with bcryptjs
- Session storage in PostgreSQL database
- Automatic session cleanup

### 3. Middleware Updates

**Before (Clerk):**
```typescript
import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});
```

**After (Custom JWT):**
```typescript
import { verifySessionFromRequest } from '@/lib/auth';
// Checks JWT token, allows public routes, redirects to /sign-in if unauthorized
```

### 4. API Routes Updates

**All API routes updated** (15 files):
- Replaced `import { auth } from "@clerk/nextjs"` with `import { getCurrentUser } from "@/lib/auth"`
- Changed `const { userId } = auth()` to proper async user fetching with error handling
- Added GET endpoint to `/api/stores` for fetching user stores

### 5. Component Updates

**Admin Components:**
- `components/admin/navbar.tsx` - Now client component, uses `useAuth()` hook
- `app/(admin)/layout.tsx` - Replaced `ClerkProvider` with `AuthProvider`
- `app/(admin)/(dashboard)/[storeId]/layout.tsx` - Uses `getCurrentUser()`
- `app/(admin)/(root)/layout.tsx` - Uses `getCurrentUser()`
- `app/(admin)/(dashboard)/[storeId]/(routes)/settings/page.tsx` - Uses `getCurrentUser()`

**Auth Pages:**
- `app/(admin)/(auth)/(routes)/sign-in/[[...sign-in]]/page.tsx` - Custom form with react-hook-form + zod
- `app/(admin)/(auth)/(routes)/sign-up/[[...sign-up]]/page.tsx` - Custom form with password confirmation

### 6. Dependencies

**Removed:**
- `@clerk/nextjs`
- `mongodb`
- `bson`

**Added:**
- `@neondatabase/serverless` - Neon database driver
- `@prisma/adapter-neon` - Prisma adapter for Neon
- `bcryptjs` + `@types/bcryptjs` - Password hashing
- `jose` - JWT signing and verification

### 7. Environment Variables

**Before (.env):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
DATABASE_URL=mongodb://...
```

**After (.env):**
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
DATABASE_URL=postgresql://...pooler.neon.tech/...
DIRECT_URL=postgresql://...neon.tech/...
```

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd /Users/awnishmehta/Desktop/ecommerce/ecommerce-unified
npm install
```

### Step 2: Configure Environment Variables

Your `.env` file already has the NeonDB connection string. Make sure to:

1. **Update JWT_SECRET**: Generate a secure random string (min 32 characters):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
2. **Verify DATABASE_URL**: Should point to your Neon pooler (already set)
   
3. **Verify DIRECT_URL**: Should point to your direct Neon connection (already set)

### Step 3: Run Database Migrations

```bash
# Generate Prisma client with new schema
npx prisma generate

# Push schema to Neon database (creates tables)
npx prisma db push

# Optional: View your database in Prisma Studio
npx prisma studio
```

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 5: Create Your First Admin Account

1. Navigate to `http://localhost:3000/sign-up`
2. Fill in:
   - Name: Your name
   - Email: Your email
   - Password: At least 8 characters
   - Confirm Password: Same as password
3. Click "Sign up"
4. You'll be automatically signed in and redirected to the dashboard

### Step 6: Create Your First Store

1. After sign-in, you'll see a modal to create your first store
2. Enter a store name (e.g., "My Store")
3. Click "Create"
4. You'll be redirected to `http://localhost:3000/{storeId}`

## 📋 Authentication Flow

### Sign Up Flow:
1. User fills form → POST `/api/auth/signup`
2. Validate email/password with Zod
3. Check if email already exists
4. Hash password with bcrypt
5. Create user in database
6. Create session (JWT + DB record)
7. Set HTTP-only cookie
8. Return success

### Sign In Flow:
1. User fills form → POST `/api/auth/signin`
2. Validate credentials
3. Find user by email
4. Verify password with bcrypt
5. Create session (JWT + DB record)
6. Set HTTP-only cookie
7. Return success

### Authentication Check:
1. Middleware intercepts request
2. Extract JWT from cookie
3. Verify JWT signature
4. Check session in database
5. Check expiration
6. Allow/deny access or redirect

### Sign Out Flow:
1. User clicks sign out → POST `/api/auth/signout`
2. Delete session from database
3. Clear cookie
4. Redirect to sign-in

## 🔒 Security Features

1. **Password Security**:
   - Minimum 8 characters required
   - Hashed with bcryptjs (10 rounds)
   - Never stored in plain text

2. **JWT Security**:
   - Signed with HS256 algorithm
   - 7-day expiration
   - Stored in HTTP-only cookies (not accessible via JavaScript)
   - Secure flag in production

3. **Session Management**:
   - Sessions stored in PostgreSQL
   - Automatic cleanup of expired sessions
   - Token uniqueness enforced
   - Cascade deletion when user is deleted

4. **Middleware Protection**:
   - Admin routes protected by default
   - Store frontend routes are public
   - API routes have granular access control
   - Automatic redirect to sign-in for unauthorized access

## 🔄 Data Migration (If Needed)

If you have existing data in MongoDB that needs to be migrated:

1. Export data from MongoDB:
   ```bash
   mongoexport --uri="mongodb://..." --collection=stores --out=stores.json
   ```

2. Transform data (remove MongoDB `_id`, ensure UUID format)

3. Import to NeonDB using Prisma:
   ```typescript
   // migration-script.ts
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   
   async function migrate() {
     // Import your data here
   }
   ```

## 📊 Database Schema Comparison

| Feature | MongoDB (Before) | PostgreSQL (After) |
|---------|-----------------|-------------------|
| ID Format | ObjectId | UUID |
| ID Field | `@map("_id")` | `@id` |
| Relations | Referenced | Foreign keys with CASCADE |
| Indexes | Manual | `@@index` directives |
| Users | Clerk (external) | User table (internal) |
| Sessions | Clerk (external) | Session table (internal) |

## ⚠️ Breaking Changes

1. **User IDs changed**: Clerk user IDs → UUIDs
   - All existing stores will need to be reassigned to new users
   - User data migration required if preserving accounts

2. **Authentication API**: Completely new endpoints
   - No more Clerk components or hooks
   - Use custom `useAuth()` hook instead

3. **Middleware behavior**: Different public/private route handling
   - Review and test all protected routes

4. **Database provider**: MongoDB → PostgreSQL
   - Different query syntax (handled by Prisma)
   - Different performance characteristics

## 🧪 Testing Checklist

- [ ] Sign up with new account
- [ ] Sign in with credentials
- [ ] Sign out
- [ ] Create a store
- [ ] Update store settings
- [ ] Create billboard
- [ ] Create category
- [ ] Create size
- [ ] Create color
- [ ] Create product with images
- [ ] View orders
- [ ] Test store frontend (public access)
- [ ] Test cart functionality
- [ ] Test Stripe checkout

## 📝 Notes

- The store frontend (`app/(store)`) remains unchanged and public
- Stripe webhook handling unchanged
- Cloudinary image uploads unchanged
- All shadcn/ui components remain the same
- Dark mode theme support preserved

## 🆘 Troubleshooting

**Issue: "Unauthorized" on all requests**
- Check JWT_SECRET is set in .env
- Verify cookie is being set (check browser DevTools → Application → Cookies)
- Check session exists in database

**Issue: Database connection errors**
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Neon project is active
- Run `npx prisma db push` again

**Issue: Password not working**
- Password must be at least 8 characters
- Check for typos
- Try creating a new account

**Issue: Prisma client errors**
- Run `npx prisma generate`
- Delete `node_modules/.prisma` and regenerate
- Restart dev server

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

**Migration completed by Kiro AI on** September 4, 2026
