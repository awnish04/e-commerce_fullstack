# Project Restructuring Plan

## Overview
Restructure the ecommerce project to follow Next.js best practices with a cleaner, more maintainable folder organization.

## Current vs Proposed Structure

### Current Issues
1. `providers/` folder at root level (should be in `components/`)
2. `types.ts` at root level (should be in `lib/` or `shared/`)
3. `actions/` at root level (acceptable but could be in `lib/`)
4. Multiple documentation files cluttering root
5. Test files in root directory

### Proposed New Structure

```
ecommerce-unified/
├── app/
│   ├── (admin)/
│   │   ├── (auth)/
│   │   │   └── (routes)/
│   │   │       ├── sign-in/
│   │   │       └── sign-up/
│   │   ├── (dashboard)/
│   │   │   └── [storeId]/
│   │   │       ├── layout.tsx
│   │   │       └── (routes)/
│   │   │           ├── page.tsx (Dashboard)
│   │   │           ├── billboards/
│   │   │           ├── categories/
│   │   │           ├── products/
│   │   │           ├── orders/
│   │   │           └── settings/
│   │   └── layout.tsx
│   ├── (store)/
│   │   ├── (routes)/
│   │   │   ├── page.tsx (Homepage)
│   │   │   ├── category/
│   │   │   ├── product/
│   │   │   └── cart/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── stores/
│   │   ├── [storeId]/
│   │   │   ├── billboards/
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── checkout/
│   │   └── webhook/
│   ├── globals.css
│   ├── layout.tsx
│   └── favicon.ico
│
├── components/
│   ├── admin/
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── site-header.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── dashboard/
│   │   │   └── overview.tsx
│   │   ├── billboards/
│   │   ├── categories/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── modals/
│   │   │   ├── store-modal.tsx
│   │   │   └── alert-modal.tsx
│   │   └── shared/
│   │       ├── store-switcher.tsx
│   │       ├── heading.tsx
│   │       └── api-alert.tsx
│   ├── store/
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── main-navbar.tsx
│   │   ├── products/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-detail-modern.tsx
│   │   │   └── product-list.tsx
│   │   ├── cart/
│   │   │   ├── cart-item.tsx
│   │   │   └── cart-summary.tsx
│   │   └── ui/
│   │       ├── container.tsx
│   │       ├── currency.tsx
│   │       └── icon-button.tsx
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   ├── modal-provider.tsx
│   │   └── theme-provider.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ... (all shadcn components)
│
├── lib/
│   ├── actions/
│   │   ├── admin/
│   │   │   ├── get-total-revenue.ts
│   │   │   ├── get-sales-count.ts
│   │   │   ├── get-stock-count.ts
│   │   │   └── get-graph-revenue.ts
│   │   ├── get-billboard.tsx
│   │   ├── get-categories.tsx
│   │   ├── get-products.tsx
│   │   └── ... (all actions)
│   ├── api/
│   │   ├── error.ts
│   │   └── response.ts
│   ├── auth/
│   │   ├── auth.ts
│   │   └── session.ts
│   ├── db/
│   │   └── prismadb.ts
│   ├── email/
│   │   └── templates/
│   ├── stripe/
│   │   └── stripe.ts
│   ├── validations/
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   └── store.ts
│   └── utils.ts
│
├── hooks/
│   ├── use-cart.tsx
│   ├── use-origin.tsx
│   ├── use-preview-modal.tsx
│   └── use-store-modal.tsx
│
├── shared/
│   └── types/
│       ├── index.ts
│       ├── product.ts
│       ├── store.ts
│       └── order.ts
│
├── config/
│   ├── site.ts
│   └── stripe.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── images/
│
├── scripts/
│   ├── seed.ts
│   └── migrate.ts
│
├── docs/
│   ├── ADMIN_LAYOUT_UPDATE.md
│   ├── BUILD_FIXES_APPLIED.md
│   ├── MIGRATION_GUIDE.md
│   ├── PROJECT_STATUS.md
│   ├── QUICK_FIXES.md
│   ├── README.md
│   ├── REDESIGN_SUMMARY.md
│   ├── SETUP_INSTRUCTIONS.md
│   ├── STOREFRONT_GUIDE.md
│   ├── STRUCTURE.md
│   └── TYPESCRIPT_FIXES.md
│
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── components.json
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md (main readme)
└── tsconfig.json
```

## Migration Steps

### Phase 1: Create New Folder Structure
1. Create `lib/` subdirectories
2. Create `shared/` directory
3. Create `docs/` directory
4. Create `config/` directory
5. Reorganize `components/` subdirectories

### Phase 2: Move Files
1. Move `providers/` → `components/providers/`
2. Move `actions/` → `lib/actions/`
3. Move `types.ts` → `shared/types/index.ts`
4. Move `lib/prismadb.ts` → `lib/db/prismadb.ts`
5. Move `lib/auth.ts` → `lib/auth/auth.ts`
6. Move `lib/stripe.ts` → `lib/stripe/stripe.ts`
7. Move documentation → `docs/`
8. Move test files → `scripts/` or delete

### Phase 3: Update Imports
1. Update all provider imports
2. Update all action imports
3. Update all type imports
4. Update all lib imports
5. Verify no broken imports

### Phase 4: Clean Up Root
1. Move all .md files to `docs/`
2. Remove test files
3. Keep only essential config files in root

### Phase 5: Verify & Test
1. Run build
2. Check for import errors
3. Test all routes
4. Verify functionality

## Benefits

1. **Better Organization:** Clear separation of concerns
2. **Easier Navigation:** Logical folder hierarchy
3. **Scalability:** Easy to add new features
4. **Maintainability:** Standard Next.js structure
5. **Team Collaboration:** Industry-standard patterns
6. **Clean Root:** Only config files at root level

## Import Path Changes

### Before → After
```typescript
// Providers
'@/providers/auth-provider' → '@/components/providers/auth-provider'
'@/providers/admin/theme-provider' → '@/components/providers/theme-provider'

// Actions
'@/actions/get-products' → '@/lib/actions/get-products'
'@/actions/admin/get-total-revenue' → '@/lib/actions/admin/get-total-revenue'

// Types
'@/types' → '@/shared/types'

// Database
'@/lib/prismadb' → '@/lib/db/prismadb'

// Auth
'@/lib/auth' → '@/lib/auth/auth'

// Stripe
'@/lib/stripe' → '@/lib/stripe/stripe'
```

## Files to Keep in Root
- `.env`
- `.env.example`
- `.eslintrc.json`
- `.gitignore`
- `components.json`
- `next.config.js`
- `package.json`
- `pnpm-lock.yaml`
- `postcss.config.js`
- `README.md` (main project readme)
- `tsconfig.json`

## Files to Move to /docs
- ADMIN_LAYOUT_UPDATE.md
- BUILD_FIXES_APPLIED.md
- CLOUDINARY_TO_NEONDB_MIGRATION.md
- COMPLETE_REDESIGN_PLAN.md
- DATABASE_TROUBLESHOOTING.md
- ENV_SETUP_CHECKLIST.md
- FINAL_UPDATE_SUMMARY.md
- IMAGE_STORAGE_INFO.md
- MIGRATION_GUIDE.md
- NEON_FIXED.md
- NEW_HOMEPAGE_DESIGN.md
- NEXTJS_15_MIGRATION_COMPLETE.md
- PROJECT_STATUS.md
- QUICK_FIX.md
- QUICK_FIXES.md
- REDESIGN_IMPLEMENTATION_SUMMARY.md
- REDESIGN_SUMMARY.md
- SETUP_INSTRUCTIONS.md
- STOREFRONT_GUIDE.md
- STRUCTURE.md
- SWITCH_TO_SQLITE.md
- TYPESCRIPT_FIXES.md

## Files to Delete
- check-store.js
- test-connection.mjs
- test-neon.js
- wake-neon.mjs
- tailwind.config.ts.backup
- proxy.ts (if not used)

## Timeline
- Phase 1: 10 minutes (create directories)
- Phase 2: 20 minutes (move files)
- Phase 3: 30 minutes (update imports)
- Phase 4: 10 minutes (cleanup)
- Phase 5: 15 minutes (verify & test)

**Total Estimated Time:** ~90 minutes

## Notes
- Use global find & replace for import updates
- Test after each phase
- Create git commit after each phase
- Keep backup before starting
