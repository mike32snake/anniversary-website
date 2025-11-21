# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite anniversary website featuring a 5th anniversary celebration page for Meghan. The site uses advanced 3D graphics with React Three Fiber and scroll-based animations with Framer Motion.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint the codebase
npm run lint

# Optimize images (use when adding new photos)
node scripts/optimize-images.js
```

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **3D Graphics**: React Three Fiber + React Three Drei + React Three Postprocessing
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React

## Architecture

### Component Structure

The app is organized into 4 main scroll-based sections, each implemented as a standalone component:

1. **Hero** (`src/components/Hero.jsx`) - Landing section with animated title and scroll prompt
2. **LoveLetter** (`src/components/LoveLetter.jsx`) - Personal message section
3. **Gallery** (`src/components/Gallery.jsx`) - Photo gallery from `public/gallery/` directory
4. **Present** (`src/components/Present.jsx`) - Interactive 3D ring box with scroll-based reveal

### 3D Graphics Implementation

The `RingBox3D.jsx` component contains a complex Three.js scene featuring:
- **Custom ring geometry**: 30-diamond eternity ring with procedurally generated band using ExtrudeGeometry
- **Scroll-driven animations**: Box opening and ring reveal tied to scroll position via Framer Motion's `useScroll`
- **Advanced materials**: Uses `meshPhysicalMaterial` with transmission/IOR for realistic diamond rendering
- **Post-processing**: Bloom effect for diamond sparkle

Key technical details:
- Ring band created using ExtrudeGeometry with custom Shape and CatmullRomCurve3 path
- Diamonds positioned using polar coordinates around band circumference
- Opacity transitions managed through state passed from parent `Present` component

### Styling System

Custom Tailwind theme (`tailwind.config.js`) defines:
- Brand colors: `love-red` (#D90429), `soft-pink` (#FFD6E0), `deep-maroon` (#640D14), `gold` (#FFD700)
- Fonts: Playfair Display (serif) for headings, Inter (sans) for body

### Assets

- Gallery images: `public/gallery/` (131 images)
- Other images: `public/images/` (21 images)
- Component imports use relative paths to public directory

## Common Patterns

### Scroll-based animations
Components use Framer Motion's `useScroll` with target refs and offset arrays to trigger animations at specific scroll positions:
```javascript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end end"]
});
```

### 3D scene setup
React Three Fiber Canvas configured with:
- Shadow mapping enabled
- Reinhard tone mapping for realistic lighting
- Environment preset for ambient lighting
- Post-processing via EffectComposer

## Image Optimization

Images are optimized using Sharp (scripts/optimize-images.js):
- Resizes images to max 1920px width
- Converts to progressive JPEG at 80% quality
- Original images backed up to `public-backup/` directory
- Achieved 88.4% size reduction (432MB → 50MB)

Gallery component implements:
- Native lazy loading (`loading="lazy"`)
- Async image decoding (`decoding="async"`)
- Progressive loading (50 images initially, then load more on demand)
- Dynamic import with Vite's glob feature for gallery images
