# Project Structure

This document explains the organization of the ecommerce-unified project.

## Directory Structure

```
ecommerce-unified/
├── app/
│   ├── (admin)/              # Admin Dashboard (Protected)
│   │   ├── (auth)/           # Auth pages (sign-in, sign-up)
│   │   ├── (dashboard)/      # Dashboard pages
│   │   │   └── [storeId]/    # Store-specific admin pages
│   │   │       ├── (routes)/
│   │   │       │   ├── billboards/
│   │   │       │   ├── categories/
│   │   │       │   ├── products/
│   │   │       │   ├── orders/
│   │   │       │   └── settings/
│   │   │       └── layout.tsx
│   │   └── layout.tsx
│   │
│   ├── (store)/              # Customer-facing Store (Public)
│   │   ├── (routes)/
│   │   │   ├── cart/
│   │   │   ├── category/[categoryId]/
│   │   │   └── product/[productId]/
│   │   └── layout.tsx
│   │
│   └── api/                  # API Routes
│       ├── [storeId]/        # Store-specific APIs
│       │   ├── billboards/
│       │   ├── categories/
│       │   ├── products/
│       │   ├── orders/
│       │   └── checkout/
│       ├── auth/             # Authentication APIs
│       ├── stores/           # Store management
│       └── webhook/          # Payment webhooks
│
├── actions/                  # Server actions for data fetching
│   ├── admin/               # Admin-specific actions
│   └── get-*.tsx            # Public data fetchers
│
├── components/
│   ├── admin/               # Admin dashboard components
│   ├── store/               # Store frontend components
│   └── ui/                  # Shared shadcn components
│
├── lib/                     # Utilities and helpers
├── prisma/                  # Database schema and migrations
└── types.ts                 # TypeScript type definitions
```

## Key Concepts

### Admin Section (`app/(admin)`)
- **Purpose**: Store management dashboard
- **Access**: Protected by authentication
- **Features**:
  - Manage stores, billboards, categories
  - Create and edit products (with size/color as simple string fields)
  - View orders and analytics
  - Store settings

### Store Section (`app/(store)`)
- **Purpose**: Customer-facing ecommerce site
- **Access**: Public
- **Features**:
  - Browse products by category
  - Product detail pages
  - Shopping cart with quantity controls
  - Checkout flow

### API Routes (`app/api`)
- RESTful endpoints for both admin and store
- Organized by resource type
- Store-scoped routes under `[storeId]`

## Data Model Changes

### Simplified Product Schema
- **Before**: Separate `Size` and `Color` models with many-to-many relations
- **After**: Direct `size` and `color` string fields on `Product`
- **Benefits**:
  - Simpler data model
  - Faster queries
  - Easier to add product variants
  - No complex relationship management

### Billboard Relationship
- One-to-one relationship with Store
- Each store has exactly one featured billboard
- Billboard displayed on store homepage

## Component Organization

### Admin Components (`components/admin/`)
- Modal dialogs
- Admin-specific UI elements
- Dashboard widgets

### Store Components (`components/store/`)
- Navigation and navbar
- Product cards and listings
- Cart functionality
- Store-specific UI

### Shared UI (`components/ui/`)
- shadcn/ui components
- Reusable across admin and store
- Buttons, inputs, dialogs, etc.

## Naming Conventions

- **Route Groups**: Use parentheses for organizational folders `(admin)`, `(store)`
- **Dynamic Routes**: Square brackets for parameters `[storeId]`, `[productId]`
- **Components**: PascalCase for component files
- **Actions**: kebab-case with `get-` prefix for data fetchers
- **APIs**: RESTful conventions (GET, POST, PATCH, DELETE)

## Development Workflow

1. **Admin Development**: Work in `app/(admin)` and `components/admin/`
2. **Store Development**: Work in `app/(store)` and `components/store/`
3. **API Development**: Add routes in `app/api/`
4. **Data Fetching**: Create actions in `actions/`
5. **Shared Components**: Use or extend `components/ui/`

## Migration Notes

- Size and Color models have been removed
- Old size/color admin pages have been deleted
- Products now use simple string fields for size/color
- Database schema has been simplified and optimized
