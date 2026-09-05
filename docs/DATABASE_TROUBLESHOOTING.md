# 🔧 Database Connection Troubleshooting

## ⚠️ Current Issue: Database Connection Timeout

Your application is experiencing connection timeouts to the Neon PostgreSQL database. This means the database queries are taking longer than 76 seconds, which is causing authentication and other operations to fail.

---

## 🔍 Possible Causes:

### 1. **Neon Database is Suspended (Most Likely)**
Neon databases on the free tier auto-suspend after inactivity and take time to wake up.

### 2. **Network Issues**
Firewall or network configuration blocking connections.

### 3. **Connection Pool Exhaustion**
Too many open connections to the database.

### 4. **Database Overload**
Database is processing too many queries.

---

## ✅ Solutions:

### Solution 1: Wake Up Your Neon Database ⭐ **TRY THIS FIRST**

1. **Visit Neon Console**: https://console.neon.tech
2. **Select your project**: `neondb`
3. **Check database status**: Look for "Active" or "Suspended"
4. **If suspended**: 
   - Click on the database
   - Click "Wake up" or run any query in the SQL editor
   - Wait 10-30 seconds for it to become active

5. **Test connection** in Neon console:
   ```sql
   SELECT NOW();
   ```

### Solution 2: Update Connection Settings

The `.env` file has been updated with:
```env
DATABASE_URL=postgresql://...?connect_timeout=10&pool_timeout=10
```

This adds connection timeouts to prevent long waits.

### Solution 3: Check Firewall/Network

1. **Check if you can reach Neon**:
   ```bash
   ping ep-gentle-sunset-aedvk89p-pooler.c-2.us-east-2.aws.neon.tech
   ```

2. **Check if port 5432 is open**:
   ```bash
   nc -zv ep-gentle-sunset-aedvk89p-pooler.c-2.us-east-2.aws.neon.tech 5432
   ```

### Solution 4: Generate New Connection URL

If your Neon database was recreated or reset:

1. Go to: https://console.neon.tech
2. Navigate to your project
3. Go to **Connection Details**
4. Copy the **new connection string**
5. Update `.env`:
   ```env
   DATABASE_URL=<new-connection-string>
   ```

### Solution 5: Use Direct Connection (Bypass Pooler)

Try using the direct URL instead of pooled:

In `.env`, replace:
```env
DATABASE_URL=postgresql://neondb_owner:npg_31RoJvVSebIa@ep-gentle-sunset-aedvk89p.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

(Use the `DIRECT_URL` value as `DATABASE_URL`)

### Solution 6: Restart Dev Server

After making any changes:
```bash
# Kill existing server
lsof -ti:3000 | xargs kill -9

# Start fresh
pnpm run dev
```

---

## 🧪 Test Database Connection

Run this to test your connection:
```bash
cd /Users/awnishmehta/Desktop/ecommerce/ecommerce-unified
node scripts/test-db-connection.js
```

Expected output if working:
```
✅ Connected successfully in 150ms
✅ Query executed in 45ms
✅ Found 11 tables
```

---

## 🚀 Quick Fix Steps (Recommended Order)

### Step 1: Wake Database
1. Visit https://console.neon.tech
2. Ensure database is "Active"
3. Run a test query in SQL editor

### Step 2: Update Environment
1. Check `.env` has correct credentials
2. Ensure connection string has timeout parameters
3. Save changes

### Step 3: Regenerate Prisma Client
```bash
pnpm prisma generate
```

### Step 4: Restart Server
```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Start dev server
pnpm run dev
```

### Step 5: Test
Visit http://localhost:3000 and try to sign in

---

## 📊 What I've Already Fixed:

✅ Added connection pool settings with timeouts
✅ Added timeout handling in auth functions
✅ Added better error logging
✅ Updated DATABASE_URL with connection timeouts
✅ Improved Prisma client initialization

---

## 🆘 If Still Not Working:

### Option A: Use SQLite for Local Development

If Neon continues to timeout, you can switch to SQLite temporarily:

1. **Update `schema.prisma`**:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Update `prismadb.ts`**:
   ```typescript
   const prismadb = new PrismaClient({
     log: ['error', 'warn'],
   });
   ```

3. **Push schema**:
   ```bash
   pnpm prisma db push
   ```

### Option B: Create New Neon Database

1. Go to https://console.neon.tech
2. Create a **new project**
3. Copy the connection string
4. Update `.env`
5. Run `pnpm prisma db push`

---

## 📝 Current Configuration

Your current Neon endpoint:
```
Host: ep-gentle-sunset-aedvk89p-pooler.c-2.us-east-2.aws.neon.tech
Region: us-east-2 (Ohio)
Database: neondb
```

Connection improvements added:
- ✅ Connection timeout: 10 seconds
- ✅ Pool timeout: 10 seconds  
- ✅ Max pool size: 10 connections
- ✅ Idle timeout: 30 seconds
- ✅ Query timeout in auth: 5 seconds

---

## 🎯 Next Steps:

1. **Immediate**: Wake up Neon database in console
2. **Short-term**: Test connection with script
3. **Long-term**: Consider upgrading Neon plan to avoid auto-suspend

---

## ⚡ Performance Tips:

Once connected, to avoid future timeouts:

1. **Keep database active**: Visit your site regularly
2. **Upgrade Neon**: Paid plans don't auto-suspend
3. **Use connection pooling**: Already configured
4. **Add query timeouts**: Already added
5. **Monitor slow queries**: Check Neon dashboard

---

**The most likely fix**: Wake up your Neon database in the console! 🎉
