# E-Commerce Platform - Unified Next.js Application

A modern, full-stack e-commerce platform built with Next.js 16, featuring an admin dashboard and public storefront in a single unified codebase.

## ✨ Features

### Admin Dashboard
- 🏪 Multi-store management
- 📊 Revenue analytics and charts
- 📦 Product management with inventory tracking
- 🖼️ Billboard management
- 📂 Category organization
- 📋 Order tracking
- 🎨 Modern shadcn/ui dashboard design
- 🌓 Dark/Light theme support
- 🔐 Secure authentication

### Store Frontend
- 🛍️ Modern, responsive storefront
- 🎯 Product browsing and filtering
- 🛒 Shopping cart functionality
- 💳 Stripe payment integration
- 📱 Mobile-optimized design
- ⚡ Fast page loads with Next.js optimization

## 🏗️ Project Structure

```
ecommerce-unified/
├── app/
│   ├── (admin)/              # Admin dashboard (authenticated)
│   │   ├── (auth)/           # Authentication routes
│   │   │   └── (routes)/
│   │   │       ├── sign-in/
│   │   │       └── sign-up/
│   │   └── (dashboard)/[storeId]/
│   │       └── (routes)/
│   │           ├── page.tsx           # Dashboard overview
│   │           ├── billboards/
│   │           ├── categories/
│   │           ├── products/
│   │           ├── orders/
│   │           └── settings/
│   ├── (store)/              # Public storefront
│   │   ├── layout.tsx        # Store layout with navbar/footer
│   │   └── (routes)/
│   │       ├── page.tsx              # Homepage
│   │       ├── category/[categoryId]/
│   │       ├── product/[productId]/
│   │       └── cart/
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── stores/           # Store management
│   │   ├── [storeId]/        # Store-scoped endpoints
│   │   │   ├── billboards/
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── checkout/
│   │   └── webhook/          # Stripe webhook
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── admin/                # Admin dashboard components
│   │   ├── layout/           # Sidebar, header
│   │   ├── dashboard/        # Overview, charts
│   │   ├── modals/           # Store modal, alert modal
│   │   └── shared/           # Shared admin components
│   ├── store/                # Storefront components
│   │   ├── layout/           # Navbar, footer
│   │   ├── products/         # Product cards, details
│   │   ├── cart/             # Cart components
│   │   └── ui/               # Store UI components
│   ├── providers/            # Context providers
│   │   ├── auth-provider.tsx
│   │   ├── modal-provider.tsx
│   │   └── theme-provider.tsx
│   └── ui/                   # Shared shadcn/ui components
│
├── lib/
│   ├── actions/              # Server actions
│   │   ├── admin/            # Admin-specific actions
│   │   ├── get-products.tsx
│   │   ├── get-categories.tsx
│   │   └── ...
│   ├── auth/                 # Authentication utilities
│   │   └── auth.ts
│   ├── db/                   # Database client
│   │   └── prismadb.ts
│   ├── stripe/               # Stripe integration
│   │   └── stripe.ts
│   └── utils.ts              # Utility functions
│
├── shared/
│   └── types/                # Shared TypeScript types
│       └── index.ts
│
├── hooks/                    # Custom React hooks
│   ├── use-cart.tsx
│   ├── use-origin.tsx
│   └── use-store-modal.tsx
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── docs/                     # Project documentation
│   ├── README.md             # Documentation index
│   ├── SETUP_INSTRUCTIONS.md
│   ├── PROJECT_STATUS.md
│   └── ...
│
└── config files (root)
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.ts
    └── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (or Neon for serverless)
- Stripe account for payments
- Cloudinary account for image uploads (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-unified
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # Authentication (implement your own or use Clerk/NextAuth)
   AUTH_SECRET="your-secret-key"
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
   STRIPE_SECRET_KEY="sk_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # Image Upload (optional)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   pnpm prisma db push
   
   # Generate Prisma client
   pnpm prisma generate
   
   # (Optional) View database in Prisma Studio
   pnpm prisma studio
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

All project documentation is located in the `/docs` folder:

- **[Setup Guide](./docs/SETUP_INSTRUCTIONS.md)** - Detailed setup instructions
- **[Project Status](./docs/PROJECT_STATUS.md)** - Current project status
- **[Structure Guide](./docs/STRUCTURE.md)** - Folder structure details
- **[Troubleshooting](./docs/QUICK_FIXES.md)** - Common issues and fixes

[View all documentation →](./docs/README.md)

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Custom auth system
- **Styling:** Tailwind CSS

### UI & Components
- **Component Library:** shadcn/ui
- **Primitives:** Radix UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### Payment & Media
- **Payments:** Stripe
- **Image Upload:** Cloudinary / Neon Database
- **Image Optimization:** Next.js Image

### State & Data
- **Client State:** Zustand
- **Server State:** React Server Components
- **Notifications:** React Hot Toast

## 🔑 Key Features Explained

### Route Groups
The project uses Next.js route groups `(admin)` and `(store)` to organize routes without affecting URLs:
- `/sign-in` → Admin authentication
- `/{storeId}` → Admin dashboard
- `/` → Store homepage
- `/product/{id}` → Product details

### Simplified Product Schema
Products have integrated size and color fields (strings) instead of separate models, making the schema simpler and more flexible.

### Multi-Store Support
Single admin can manage multiple stores with a store switcher in the dashboard.

### Modern Dashboard
Built with shadcn/ui dashboard components featuring:
- Collapsible sidebar
- Breadcrumb navigation
- Theme switching
- Revenue charts

## 📜 Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm prisma generate     # Generate Prisma client
pnpm prisma db push      # Push schema changes
pnpm prisma studio       # Open Prisma Studio
pnpm prisma migrate dev  # Create migration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Need help?** Check the [documentation](./docs/README.md) or open an issue.
# e-commerce_fullstack
