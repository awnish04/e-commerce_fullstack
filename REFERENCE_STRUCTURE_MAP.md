# Reference Structure Mapping

## Overview
This document maps the reference portfolio project structure to understand what needs to be implemented in the ecommerce-unified project for the shadcn dashboard-01 design pattern.

---

## App Structure

### Reference: `/Users/awnishmehta/Desktop/ecommerce/app/`

```
app/
├── (admin)/
│   └── admin/
│       ├── layout.tsx                    # Dashboard layout with sidebar
│       ├── settings/page.tsx
│       ├── contact/
│       │   ├── page.tsx
│       │   └── messages/page.tsx
│       ├── projects/
│       │   ├── page.tsx
│       │   └── hero/page.tsx
│       ├── about/
│       │   ├── experience/page.tsx
│       │   ├── education/page.tsx
│       │   └── hero/page.tsx
│       ├── skill-sync/page.tsx
│       ├── cv/page.tsx
│       └── skills/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── reset-password/page.tsx
├── (public)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── projects/page.tsx
├── api/                                   # API routes
├── layout.tsx                             # Root layout
├── globals.css                            # Global styles
└── favicon.ico
```

### Key Layout Pattern (Reference)

**File:** `app/(admin)/admin/layout.tsx`

```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background/50 backdrop-blur-md">
      <SidebarTrigger className="ml-1" />
      <Separator orientation="vertical" className="h-full" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbCurrentPage />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <MessageNotifications />
      </div>
    </header>
    <main className="flex-1 p-4 overflow-auto">{children}</main>
  </SidebarInset>
</SidebarProvider>
```

**Key Features:**
- ✅ Simple `SidebarProvider` (no CSS custom properties for width/height)
- ✅ Standard `AppSidebar` (no variant prop)
- ✅ Header with fixed height (h-16), border-b, backdrop blur
- ✅ Breadcrumb navigation
- ✅ Notification components in header
- ✅ Main content with padding and overflow-auto
- ❌ NO `variant="inset"` used
- ❌ NO CSS variables for sidebar-width or header-height
- ❌ NO @container/main wrapper

---

## Components Structure

### Reference: `/Users/awnishmehta/Desktop/ecommerce/components/`

```
components/
├── admin/
│   ├── layout/                           # Layout components
│   │   ├── AppSidebar.tsx               ⭐ Main sidebar component
│   │   ├── NavMain.tsx                  ⭐ Navigation with collapsible groups
│   │   ├── NavUser.tsx                  ⭐ User dropdown in sidebar footer
│   │   ├── TeamSwitcher.tsx             ⭐ Brand/logo in sidebar header
│   │   ├── BreadcrumbCurrentPage.tsx    # Dynamic breadcrumb
│   │   ├── MessageNotifications.tsx     # Header notifications
│   │   └── ModeToggle.tsx              # Theme toggle
│   ├── analytics/
│   │   ├── VisitorCharts.tsx
│   │   └── VisitorTable.tsx
│   ├── contact/
│   │   └── ContactDetailsEditor.tsx
│   ├── cv/
│   │   ├── CvDropzone.tsx
│   │   └── CvManager.tsx
│   ├── education/
│   │   ├── EducationDataTable.tsx
│   │   └── EducationForm.tsx
│   ├── experience/
│   │   ├── ExperienceDataTable.tsx
│   │   └── ExperienceForm.tsx
│   ├── hero/
│   │   └── HeroEditor.tsx
│   ├── messages/
│   │   ├── MessageDataTable.tsx
│   │   └── MessageDialog.tsx
│   ├── projects/
│   │   ├── ProjectDataTable.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectTable.tsx
│   │   └── ... (pagination, search, actions)
│   ├── skills/
│   │   ├── SkillDataTable.tsx
│   │   ├── SkillForm.tsx
│   │   └── ... (table components)
│   └── shared/                          # Reusable admin components
│       ├── AdminSearchBar.tsx
│       ├── DeleteConfirmationDialog.tsx
│       ├── LabelInputContainer.tsx
│       ├── RowActionsDropdown.tsx
│       ├── SortableDataTable.tsx
│       └── TechStackSelector.tsx
├── auth/                                 # Auth components
├── providers/                            # Context providers
├── public/                               # Public-facing components
└── ui/                                   # shadcn/ui components
```

---

## Key Admin Layout Components Analysis

### 1. AppSidebar.tsx

**Structure:**
```tsx
<Sidebar collapsible="icon" {...props}>
  <SidebarHeader>
    <TeamSwitcher teams={teams} />
  </SidebarHeader>
  <SidebarContent>
    <NavMain items={sidebarNavItems} />
  </SidebarContent>
  <SidebarFooter>
    <NavUser />
  </SidebarFooter>
  <SidebarRail />
</Sidebar>
```

**Features:**
- Accepts all `Sidebar` component props via spread
- Uses `collapsible="icon"` mode
- Three sections: Header (logo/brand), Content (navigation), Footer (user menu)
- `SidebarRail` for resize handle

---

### 2. NavMain.tsx

**Structure:**
- Collapsible navigation groups
- Active state detection via `usePathname()`
- Parent items with children toggle (don't navigate)
- Leaf items navigate directly
- Auto-opens group when child route is active
- ChevronRight icon rotates on open/close

**Key Logic:**
```tsx
const inside = pathname === item.href || pathname.startsWith(`${item.href}/`);
<Collapsible key={`${item.title}:${inside}`} defaultOpen={item.isActive || inside}>
```

**Pattern:**
- Parent with children → `CollapsibleTrigger` (no Link)
- Leaf item → `SidebarMenuButton` with Link

---

### 3. NavUser.tsx

**Features:**
- Avatar with initials fallback
- Dropdown menu with:
  - User info display
  - Theme toggle (Sun/Moon icon)
  - Settings link
  - Sign out button
- Uses `authClient.getSession()` for profile
- Uses `authClient.signOut()` for logout
- Dynamic name/email from session

---

### 4. TeamSwitcher.tsx

**Features:**
- Profile image/logo display
- Team name and plan display
- Can be used as brand/logo section
- Simple non-interactive button (no dropdown in this implementation)

---

## Admin Page Pattern

### Typical Structure
```tsx
export default function Page() {
  // Hooks for data management
  const { data, isLoading, handleEdit, handleDelete, ... } = useManager();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Form onSubmit={handleAdd} initialData={editingEntry} />
      <DataTable 
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  );
}
```

**Pattern:**
- Simple container with `space-y-6`
- Form component at top
- Data table below
- NO complex wrappers
- NO @container queries
- NO flex-1 chains

---

## Current vs Reference Comparison

### ❌ Current Implementation (ecommerce-unified)

**Layout:** `app/(admin)/(dashboard)/[storeId]/layout.tsx`
```tsx
<SidebarProvider style={{ 
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)" 
}}>
  <AppSidebar variant="inset" />
  <SidebarInset>
    <SiteHeader />
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        {children}
      </div>
    </div>
  </SidebarInset>
</SidebarProvider>
```

**Issues:**
- ❌ CSS custom properties not standard
- ❌ `variant="inset"` not in reference
- ❌ Extra wrapper divs with flex-1
- ❌ @container/main not in reference
- ❌ SiteHeader separate component (should be inline header)

---

### ✅ Reference Implementation

**Layout:** `app/(admin)/admin/layout.tsx`
```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background/50 backdrop-blur-md">
      {/* Header content inline */}
    </header>
    <main className="flex-1 p-4 overflow-auto">
      {children}
    </main>
  </SidebarInset>
</SidebarProvider>
```

**Advantages:**
- ✅ Simple, clean structure
- ✅ Standard sidebar (no variant)
- ✅ Inline header (no separate component needed)
- ✅ Direct main wrapper with p-4
- ✅ No complex CSS variables
- ✅ No container queries

---

## Migration Checklist for ecommerce-unified

### Layout Changes

- [ ] **Remove CSS custom properties** from SidebarProvider style
- [ ] **Remove `variant="inset"`** from AppSidebar
- [ ] **Simplify layout structure** - remove extra wrapper divs
- [ ] **Remove @container/main** wrapper
- [ ] **Move header inline** instead of separate SiteHeader component
- [ ] **Update header styling** to match reference (h-16, border-b, backdrop-blur-md)

### Component Updates

- [ ] **Update AppSidebar** to match reference structure
- [ ] **Update/Create NavMain** with collapsible logic
- [ ] **Update/Create NavUser** with proper dropdown
- [ ] **Create TeamSwitcher** for sidebar header (store selector)
- [ ] **Update breadcrumb** to be dynamic based on route

### Page Updates

- [ ] **Simplify dashboard page** - remove complex wrappers
- [ ] **Use space-y-6** instead of gap-4/gap-6
- [ ] **Remove @container usage**
- [ ] **Keep cards but simplify layout**

### Styling Updates

- [ ] **Update main padding** to `p-4` (reference uses this)
- [ ] **Update header** to fixed h-16
- [ ] **Ensure overflow-auto** on main content
- [ ] **Match border and backdrop blur** styling

---

## Config Files

### Reference has:
- `/config/sidebar-nav.ts` - Navigation items configuration
- Uses centralized config for navigation structure

### ecommerce-unified should create:
- Similar navigation config for billboards, categories, colors, products, orders, settings

---

## Summary of Key Differences

| Aspect | Current (ecommerce-unified) | Reference | Action |
|--------|---------------------------|-----------|--------|
| SidebarProvider | CSS vars for width/height | No inline styles | Remove CSS vars |
| AppSidebar | `variant="inset"` | No variant prop | Remove variant |
| Layout wrappers | Multiple flex-1 divs | Simple main tag | Simplify |
| @container | Uses @container/main | Not used | Remove |
| Header | Separate SiteHeader component | Inline header element | Inline it |
| Page structure | Complex nested divs | Simple space-y-6 | Simplify |
| Header height | Variable | Fixed h-16 | Fix height |

---

## Next Steps

1. ✅ Create this mapping document
2. [ ] Update layout.tsx to match reference pattern
3. [ ] Update/Create layout components (NavMain, NavUser, TeamSwitcher)
4. [ ] Simplify dashboard page structure
5. [ ] Create navigation config file
6. [ ] Test and verify visual match with reference image

---

*Generated: 2026-09-04*
*Reference Source: /Users/awnishmehta/Desktop/ecommerce/*
*Target Project: /Users/awnishmehta/Desktop/ecommerce/ecommerce-unified/*
