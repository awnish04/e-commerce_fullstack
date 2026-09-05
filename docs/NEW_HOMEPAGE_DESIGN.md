# New Homepage Design - Nivest Inspired

## 🎨 Design Overview

The new homepage features a modern, athletic-focused design inspired by premium sportswear brands with:
- Bold typography and hero sections
- Split-screen layouts with contrasting colors
- Fully responsive design
- Clean, minimalist aesthetic
- High-impact visual hierarchy

## 📱 Responsive Breakpoints

All sections adapt seamlessly across devices:
- **Mobile**: Single column, stacked sections
- **Tablet** (md: 768px+): 2-column grids, larger typography
- **Desktop** (lg: 1024px+): Full multi-column layouts
- **Large Desktop** (xl: 1280px+): Optimized spacing

## 🏗️ Homepage Sections

### 1. Hero Section (70-80vh)
- **Mobile**: 70vh height, smaller text (text-4xl)
- **Tablet**: 75vh, medium text (text-6xl)
- **Desktop**: 80vh, large text (text-8xl)
- **Features**:
  - Full-screen billboard background
  - Centered overlay text
  - CTA button
  - Dark overlay for readability

### 2. Featured Products Section
- **Layout**: Responsive grid
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large: 4 columns
- **Styling**:
  - Bold "Most Popular" heading
  - Subtitle description
  - Card-based product display

### 3. Split Hero Sections (2x)
- **Layout**: 50/50 split on desktop, stacked on mobile
- **Section 1**: "Built For The Bold"
  - Left: Stone/beige gradient with text
  - Right: Gray showcase panel
- **Section 2**: "Statement, Not Subtle"
  - Left/Right flipped on desktop
  - Cyan gradient with text
  - Black showcase panel

### 4. Testimonial Section
- **Background**: Solid black
- **Content**: Large quote text (responsive sizing)
- **Customer**: Name + photo + location
- **Mobile**: text-2xl quote
- **Desktop**: text-5xl quote

### 5. Instagram Feed
- **Layout**: 2x2 grid (mobile) → 4 columns (desktop)
- **Style**: Square aspect ratio
- **Hover**: Scale effect on images
- **CTA**: "Follow @nivest"

### 6. Trust Badges
- **Layout**: 2x2 grid (mobile) → 4 columns (desktop)
- **Features**:
  - Icon circles with brand colors
  - Benefit headlines
  - Short descriptions
- **Icons**: SVG icons (green, blue, purple, orange)

## 🎨 Color Palette

### Primary Colors:
```css
Stone/Beige: from-stone-400 to-stone-500
Cyan: from-cyan-400 to-cyan-500
Black: bg-black
White: bg-white
```

### Accent Colors:
```css
Green: bg-green-100, text-green-600
Blue: bg-blue-100, text-blue-600
Purple: bg-purple-100, text-purple-600
Orange: bg-orange-100, text-orange-600
```

### Grayscale:
```css
Gray backgrounds: from-gray-100 to-gray-300
Dark backgrounds: from-gray-800 to-gray-900
Text: text-gray-600, text-gray-900
```

## 📐 Typography Scale

### Headings:
```css
Hero H1:
- Mobile: text-4xl (2.25rem)
- Tablet: text-6xl (3.75rem)
- Desktop: text-8xl (6rem)

Section H2:
- Mobile: text-3xl (1.875rem)
- Desktop: text-5xl (3rem)

Quote:
- Mobile: text-2xl (1.5rem)
- Desktop: text-5xl (3rem)
```

### Body Text:
```css
Large: text-lg (1.125rem)
Base: text-base (1rem)
Small: text-sm (0.875rem)
```

## 🔘 Button Styles

### Primary CTA:
```css
bg-white text-black
hover:bg-gray-100
px-8 py-6 text-lg
rounded-full
shadow-xl hover:shadow-2xl
```

### Secondary CTA:
```css
border-2 border-white
bg-transparent text-white
hover:bg-white hover:text-black
rounded-full
```

## 📱 Mobile Optimizations

1. **Hero Section**:
   - Reduced height (70vh vs 80vh)
   - Smaller typography
   - Increased padding on text

2. **Grid Layouts**:
   - Single column for products
   - 2-column for trust badges
   - Stacked split sections

3. **Typography**:
   - Scaled down headings
   - Maintained readability
   - Proper line-height

4. **Spacing**:
   - Reduced padding (py-16 vs py-24)
   - Tighter gaps in grids
   - Mobile-optimized margins

## 🎯 Key Features

### Performance:
- ✅ No external image dependencies (uses base64)
- ✅ Tailwind JIT compilation
- ✅ Minimal JavaScript
- ✅ Fast page loads

### Accessibility:
- ✅ Semantic HTML
- ✅ Proper heading hierarchy
- ✅ Alt text ready
- ✅ Keyboard navigation friendly

### SEO:
- ✅ Proper H1-H6 structure
- ✅ Descriptive text
- ✅ Meta-friendly content

## 🔄 Dynamic Content

### Sections that use your database:
1. **Hero** - Uses first billboard
2. **Featured Products** - Shows products marked as "Featured"
3. **All CTAs** - Link to actual category pages

### Sections with placeholder content:
1. **Instagram Feed** - Shows 4 placeholder squares
2. **Testimonial** - Static quote (can be made dynamic)
3. **Trust Badges** - Static benefits

## 🛠️ Customization Guide

### Change Hero Colors:
```tsx
// In Hero Section 1:
className="bg-gradient-to-br from-stone-400 to-stone-500"
// Change to:
className="bg-gradient-to-br from-blue-400 to-blue-500"
```

### Adjust Section Heights:
```tsx
// Current:
className="min-h-[600px]"
// Change to:
className="min-h-[800px]"
```

### Modify Typography:
```tsx
// Current:
className="text-4xl md:text-6xl"
// Change to:
className="text-3xl md:text-5xl"
```

## 📊 Section Breakdown

| Section | Height | Responsive | Background |
|---------|--------|------------|------------|
| Hero | 70-80vh | ✅ | Billboard/Gradient |
| Featured | Auto | ✅ | White |
| Split 1 | 600px | ✅ | Stone/Gray |
| Split 2 | 600px | ✅ | Cyan/Black |
| Testimonial | Auto | ✅ | Black |
| Instagram | Auto | ✅ | Gray-50 |
| Trust | Auto | ✅ | White |

## 🚀 Performance Tips

1. **Images**: Use optimized images for billboards
2. **Grid**: Tailwind auto-generates only used classes
3. **Responsive**: Mobile-first approach reduces CSS
4. **Animations**: Minimal, performance-friendly transitions

## 🎨 Design Philosophy

Inspired by:
- **Nike**: Bold typography, athletic focus
- **Allbirds**: Clean, eco-friendly messaging
- **Away**: Split sections, lifestyle imagery
- **Nivest**: Specific layout and color combinations

---

**Your store now has a modern, premium homepage that's fully responsive and ready to convert visitors into customers! 🎉**
