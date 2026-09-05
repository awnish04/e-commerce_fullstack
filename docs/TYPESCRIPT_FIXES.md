# TypeScript Build Fixes

## Problem
Build was failing with 12 TypeScript errors in `product-form.tsx` due to type inference issues with Zod's `z.coerce.number()` and `z.preprocess()`.

### Root Cause
When using `z.coerce.number()` or `z.preprocess()` in Zod schemas, TypeScript infers the type as `unknown` instead of `number`. This caused a type mismatch with react-hook-form's `useForm` hook, which expected `price: number` and `stock: number` but received `unknown`.

## Solution
Changed the Zod schema to use plain `z.number()` and handled string-to-number conversion in the form field onChange handlers.

### Changes Made

**File:** `app/(admin)/(dashboard)/[storeId]/(routes)/products/[productId]/components/product-form.tsx`

1. **Updated Zod Schema:**
```typescript
// Before (causing type errors):
const formSchema = z.object({
  // ... other fields
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or greater"),
  // ... other fields
});

// After (working):
const formSchema = z.object({
  // ... other fields
  price: z.number().min(0.01, "Price must be at least 0.01"),
  stock: z.number().int().min(0, "Stock must be 0 or greater"),
  // ... other fields
});
```

2. **Updated Form Fields with Proper onChange Handlers:**

**Price Field:**
```typescript
<Input
  type="number"
  step="0.01"
  disabled={loading}
  placeholder="9.99"
  {...field}
  onChange={(e) => field.onChange(parseFloat(e.target.value))}
  value={field.value || ""}
/>
```

**Stock Field:**
```typescript
<Input
  type="number"
  disabled={loading}
  placeholder="100"
  {...field}
  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
  value={field.value || ""}
/>
```

## Result
✅ Build now completes successfully with no TypeScript errors
✅ All 10 pages generated without issues
✅ Dev server runs without errors
✅ Form validation works correctly with proper number types

## Build Output
```
✓ Finished TypeScript in 768ms
✓ Collecting page data using 7 workers in 914ms
✓ Generating static pages using 7 workers (10/10) in 185ms
✓ Finalizing page optimization in 14ms
```

## About the Script Tag Warning
The console warning about "script tag while rendering React component" is a Turbopack false positive and doesn't affect functionality. No actual `<script>` tags exist in the React components.

## Key Takeaways
- Avoid `z.coerce.number()` when type inference is critical
- Avoid `z.preprocess()` for the same reason
- Use plain `z.number()` with explicit onChange conversion handlers
- This ensures TypeScript can properly infer types throughout the form
