# Dialog-Based CRUD Implementation

This document describes the dialog-based CRUD implementation for the admin dashboard.

## Overview

Converted the admin dashboard from page-based forms to dialog-based forms for a better user experience. All CRUD operations (Create, Read, Update, Delete) now happen within dialogs without page navigation.

## ✅ Completed Implementation

### Billboards
- **Add New**: Dialog opens on "Add New" button click
- **Edit**: Dialog opens from table action menu
- **Delete**: Confirmation dialog with action buttons
- Dialog includes:
  - Label input field
  - Image upload component
  - Form validation
  - Loading states

### Categories
- **Add New**: Dialog opens on "Add New" button click
- **Edit**: Dialog opens from table action menu with pre-filled data
- **Delete**: Confirmation dialog
- Dialog includes:
  - Name input field
  - Billboard selection dropdown
  - Form validation
  - Loading states

### Products
- **Add New**: Dialog opens on "Add New" button click
- **Edit**: Dialog opens from table action menu with full product data
- **Delete**: Confirmation dialog
- Dialog includes:
  - Product name, description, price, stock
  - Category selector
  - Size and color inputs
  - Multiple image upload
  - Featured and archived checkboxes
  - Form validation
  - Loading states

## Components Structure

### Billboard Components
- `billboard-dialog.tsx` - Create/edit dialog
- `client.tsx` - List view with dialog trigger
- `cell-action.tsx` - Table row actions with edit/delete

### Category Components
- `category-dialog.tsx` - Create/edit dialog
- `client.tsx` - List view with dialog trigger  
- `cell-action.tsx` - Table row actions with edit/delete
- `columns.tsx` - Table columns (includes billboard label)

### Product Components
- `product-dialog.tsx` - Create/edit dialog with full form
- `client.tsx` - List view with dialog trigger
- `cell-action.tsx` - Table row actions with edit/delete

## Features

### Dialog Functionality
- ✅ Form validation using Zod
- ✅ Loading states during API calls
- ✅ Success/error toast notifications
- ✅ Auto-close on successful submit
- ✅ Form reset on close
- ✅ Prevent closing during submit
- ✅ Pre-filled data for edit mode
- ✅ Responsive design with max-width constraints
- ✅ Scrollable content for long forms
- ✅ Proper error handling

### Table Actions
- ✅ Copy ID to clipboard
- ✅ Edit (opens dialog with existing data)
- ✅ Delete (shows confirmation dialog)

### Delete Confirmation
- ✅ Reuses existing `AlertModal` component
- ✅ Shows warning message
- ✅ Cancel and Confirm buttons
- ✅ Loading state during deletion

## API Endpoints

### Billboards
- `GET /api/[storeId]/billboards` - List all billboards ✅
- `GET /api/[storeId]/billboards/[billboardId]` - Get single billboard ✅
- `POST /api/[storeId]/billboards` - Create billboard ✅
- `PATCH /api/[storeId]/billboards/[billboardId]` - Update billboard ✅
- `DELETE /api/[storeId]/billboards/[billboardId]` - Delete billboard ✅

### Categories
- `GET /api/[storeId]/categories` - List all categories ✅
- `GET /api/[storeId]/categories/[categoryId]` - Get single category ✅
- `POST /api/[storeId]/categories` - Create category ✅
- `PATCH /api/[storeId]/categories/[categoryId]` - Update category ✅
- `DELETE /api/[storeId]/categories/[categoryId]` - Delete category ✅

### Products
- `GET /api/[storeId]/products/[productId]` - Get single product ✅
- `POST /api/[storeId]/products` - Create product ✅
- `PATCH /api/[storeId]/products/[productId]` - Update product ✅
- `DELETE /api/[storeId]/products/[productId]` - Delete product ✅

## User Experience Improvements

1. **No Page Navigation**: All operations happen in-place
2. **Faster Workflow**: Users stay on the same page
3. **Better Context**: Users can see the table while editing
4. **Consistent UI**: All CRUD operations follow the same pattern
5. **Error Handling**: Clear feedback for all operations
6. **Responsive Design**: Dialogs adapt to screen size
7. **Optimistic Updates**: Router refresh ensures data is current

## Technical Implementation

### Pattern Used

```typescript
// In parent component (client.tsx)
const [open, setOpen] = useState(false);

<EntityDialog 
  isOpen={open} 
  onClose={() => setOpen(false)}
  initialData={null} // or pass data for edit
  categories={categories} // pass required data
/>

<Button onClick={() => setOpen(true)}>
  Add New
</Button>

// In cell-action.tsx
const [editOpen, setEditOpen] = useState(false);
const [entityData, setEntityData] = useState(null);

const fetchData = async () => {
  const response = await axios.get(`/api/...`);
  setEntityData(response.data);
  setEditOpen(true);
};

<EntityDialog
  isOpen={editOpen}
  onClose={() => setEditOpen(false)}
  initialData={entityData}
/>
```

### Data Flow

1. **Create**: Click "Add New" → Dialog opens → Fill form → Submit → API call → Success → Close dialog → Refresh
2. **Edit**: Click "Update" → Fetch data → Dialog opens with data → Modify form → Submit → API call → Success → Close dialog → Refresh
3. **Delete**: Click "Delete" → Confirmation dialog → Confirm → API call → Success → Close dialog → Refresh

## Dependencies

- `@radix-ui/react-dialog` - Base dialog component
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod resolver for react-hook-form
- `axios` - API calls
- `react-hot-toast` - Toast notifications

## Benefits

1. ✅ No separate form pages needed
2. ✅ Reduced code duplication
3. ✅ Better UX with in-place editing
4. ✅ Consistent patterns across all entities
5. ✅ Easy to extend to other entities
6. ✅ Maintains context while editing
7. ✅ Faster navigation and workflow
