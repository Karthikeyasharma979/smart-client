# Design System Documentation

## Overview
This document outlines the design system for the **Smart Text Analyzer** (Grammarly Landing) project. The design emphasizes a modern, high-performance aesthetic with both **Dark (Default)** and **Light** themes, featuring glassmorphism, neon accents, and smooth micro-interactions.

---

## 1. Design Tokens

### Colors
The color system uses CSS variables and HSL values for dynamic theming.

**Base Theme (Dark Default)**:
- **Background**: `#030304` (Deep Black)
- **Foreground**: `#ffffff` (Pure White)
- **Accent**: `#00FF9D` (Neon Green)
- **Muted Text**: `#a0a0ba` (Cool Grey)
- **Glass Panel**: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(12px)`

**Light Theme**:
- **Background**: `linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)` (Soft Blue-Grey)
- **Foreground**: `#1e293b` (Deep Slate)
- **Accent**: `#3b82f6` (Vibrant Blue)

### Typography
- **Primary Font**: `Inter` (Body, UI text)
- **Display Font**: `Outfit` (Headings, Hero text)
- **Scale**:
  - `h1`: Responsive (`1.5rem` mobile -> `2.5rem` desktop)
  - `body`: `text-base` (16px), `line-height: 1.6`

### Shadows & Effects
- **Glow**: `box-shadow: 0 0 20px var(--accent-glow)`
  - *Used on active states, buttons, and highlights.*
- **Glass Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Spotlight**: A moving gradient effect for hero sections.

---

## 2. Component Library

### Core Components (`src/components/ui/`)

#### Button (`Button.jsx`, `ButtonColorful.jsx`)
- **Variants**:
  - `default`: Primary background color, hover scales up.
  - `ghost`: Transparent background, hover background.
  - `outline`: Bordered, transparent background.
  - `link`: Underlined text.
- **Sizes**: `sm`, `md` (default), `lg`.
- **States**: Hover (scale 1.05, shadow), Active (scale 0.95).

#### Card (`Card.tsx`)
- **Structure**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Style**: Glassmorphic background (`glass-panel`), rounded corners (`rounded-xl`), subtle border.
- **Interactive**: Hover lift effect (`translateY(-2px)`).

#### Spotlight (`Spotlight.tsx`)
- **Usage**: Background effect for hero sections to draw focus.
- **Animation**: Drifting gradient blob.

### Feature Components (`src/components/`)

#### Navbar (`Navbar.jsx`)
- Fixed positioning with backdrop blur (`nav-bg`).
- Responsive: Collapses to hamburger menu on mobile.
- Links: Hover effect with accent color underline/glow.

#### Hero (`Hero.jsx`)
- Full-screen height (`min-h-screen`).
- Elements: Badge (`fadeInUp`), Title (`fadeInUp`), CTA Buttons (`fadeInUp`), 3D/Spline Scene.
- Animation: Staggered entrance animations.

#### Dashboard (`Dashboard.jsx`)
- Grid Layout: `bento-grid` (12 columns).
- Responsive: Stacks on mobile, side-by-side on desktop.
- Features: Stats cards, Activity Pulse visualization.

---

## 3. Layout Patterns

### Grid System
- **Desktop**: 12-column grid (`grid-cols-12`).
- **Mobile**: Single column (`grid-cols-1`) or Flex column.
- **Container**: `max-width: 1200px`, centered (`mx-auto`), padding (`px-6` / `px-12`).

### Responsive Breakpoints
- **Mobile First Approach**.
- **md (768px)**: Tablet/Small Desktop (padding increases).
- **lg (1024px)**: Desktop (grids utilize side-by-side layouts).

---

## 4. Animations & Transitions

### Keyframes
- **`fadeInUp`**: Slide up and fade in (used for hero elements).
- **`float`**: Gentle vertical floating (used for images/badges).
- **`auroraPulse`**: Background gradient pulsing.
- **`textShimmer`**: Gradient text animation for "AI" or "Magic" text.

### Transitions
- **Hover Effects**: `transition-all duration-300 ease-in-out`.
- **Theme Switch**: `transition-colors duration-300`.

---

## 5. Usage Guidelines

### Creating New Pages
1. Wrap page content in a `<div className="min-h-screen bg-background text-foreground">`.
2. Use `Navbar` at the top and `Footer` at the bottom.
3. For content sections, use `.container` with `responsive-padding`.

### Adding Features
1. Create a new component in `src/components/`.
2. Use `ui/Card` for boxing content.
3. Apply `glass-panel` class for background if not using Card.
4. Use `glare-text` or `text-primary` for headings.
