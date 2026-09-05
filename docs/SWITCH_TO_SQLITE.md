# 🔧 Quick Fix: Switch to SQLite for Local Development

## Why SQLite?

Your Neon database is refusing connections (ECONNREFUSED). Rather than troubleshoot Neon issues, let's switch to SQLite which:
- ✅ Works instantly - no setup required
- ✅ No connection issues or timeouts
- ✅ Perfect for local development
- ✅ All your data stays local
- ✅ Can switch back to Neon later

## 🚀 Quick Setup (2 minutes):

### Step 1: Update Prisma Schema

Open `prisma/schema.prisma` and change the datasource:

**FROM:**
```prisma
datasource db {
  provider = "postgresql"
}
```

**TO:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Update prismadb.ts

Open `lib/prismadb.ts` and replace EVERYTHING with:

```typescript
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
}

export default prismadb;
```

### Step 3: Generate and Push Schema

```bash
cd /Users/awnishmehta/Desktop/ecommerce/ecommerce-unified

# Generate Prisma client
pnpm prisma generate

# Create database and tables
pnpm prisma db push
```

### Step 4: Start Dev Server

```bash
pnpm run dev
```

### Step 5: Create Your Store!

Visit http://localhost:3000 and create your first store!

---

## ✅ That's It!

Your app will now work perfectly with SQLite. No more connection errors!

---

## 🔄 Want to Switch Back to Neon Later?

When you're ready to use Neon again:

1. Get a fresh Neon database URL from https://console.neon.tech
2. Update `.env` with new DATABASE_URL
3. Change `prisma/schema.prisma` back to `provider = "postgresql"`
4. Update `lib/prismadb.ts` with the pg adapter code
5. Run `pnpm prisma db push`

---

## 📊 SQLite vs PostgreSQL

**SQLite is perfect for:**
- ✅ Local development
- ✅ Testing features
- ✅ Learning the codebase
- ✅ No internet connection needed

**Use PostgreSQL (Neon) for:**
- Production deployment
- Team collaboration
- Large datasets
- Complex queries

For your current situation, SQLite is the best choice! 🎉
