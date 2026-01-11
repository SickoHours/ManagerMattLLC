# ManagerMattLLC Design System - Style Guide

> **Design Philosophy**: Apple/Tesla-grade luxury. Not "nice Tailwind." It must feel *expensive*.

---

## 1. Spacing Scale

Based on an **8px grid system**. Use these values exclusively — no arbitrary spacing.

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| `space-1` | 4px | `--space-1` | Tight gaps (icon-to-text) |
| `space-2` | 8px | `--space-2` | Default element spacing |
| `space-3` | 12px | `--space-3` | Small component padding |
| `space-4` | 16px | `--space-4` | Standard component padding |
| `space-6` | 24px | `--space-6` | Section internal spacing |
| `space-8` | 32px | `--space-8` | Card padding |
| `space-12` | 48px | `--space-12` | Section gaps |
| `space-16` | 64px | `--space-16` | Major section spacing |
| `space-24` | 96px | `--space-24` | Hero vertical padding |
| `space-32` | 128px | `--space-32` | Cinematic whitespace |

### Tailwind Config
```js
spacing: {
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '6': '24px',
  '8': '32px',
  '12': '48px',
  '16': '64px',
  '24': '96px',
  '32': '128px',
}
```

---

## 2. Typography Scale

Premium typography with tight tracking on headlines, comfortable reading on body.

### Font Family
- **Primary**: Inter (via `next/font/google`)
- **Fallback**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Labels, buttons |
| Semibold | 600 | Headings, emphasis |

### Type Scale

| Token | Size/Line Height | Letter Spacing | Usage |
|-------|------------------|----------------|-------|
| `display` | 72px / 80px | -0.02em | Hero headlines only |
| `h1` | 48px / 56px | -0.02em | Page titles |
| `h2` | 36px / 44px | -0.01em | Section headings |
| `h3` | 24px / 32px | -0.01em | Card titles |
| `h4` | 20px / 28px | 0 | Subsection headings |
| `body` | 16px / 24px | 0 | Default text |
| `body-sm` | 14px / 20px | 0 | Secondary text |
| `label` | 12px / 16px | 0.02em | Labels, captions |
| `label-xs` | 11px / 14px | 0.04em | Badges, tiny text |

### Tailwind Config
```js
fontSize: {
  'display': ['72px', { lineHeight: '80px', letterSpacing: '-0.02em' }],
  'h1': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
  'h2': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em' }],
  'h3': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
  'h4': ['20px', { lineHeight: '28px', letterSpacing: '0' }],
  'body': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
  'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0' }],
  'label': ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
  'label-xs': ['11px', { lineHeight: '14px', letterSpacing: '0.04em' }],
}
```

### Mobile Responsive Scale
On screens < 768px:
- `display` → 48px / 56px
- `h1` → 36px / 44px
- `h2` → 28px / 36px

---

## 3. Color Palette

**Rule**: Neutral palette + ONE accent color. No random colors anywhere.

### Neutrals (Primary Palette)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `bg-page` | #FAFAFA | 250, 250, 250 | Page background |
| `bg-surface` | #FFFFFF | 255, 255, 255 | Cards, modals |
| `bg-subtle` | #F5F5F5 | 245, 245, 245 | Hover states, dividers |
| `text-primary` | #0A0A0A | 10, 10, 10 | Headlines, primary text |
| `text-secondary` | #525252 | 82, 82, 82 | Body text, descriptions |
| `text-muted` | #A3A3A3 | 163, 163, 163 | Placeholders, disabled |
| `border-default` | #E5E5E5 | 229, 229, 229 | Card borders, inputs |
| `border-subtle` | #F0F0F0 | 240, 240, 240 | Dividers, separators |

### Accent Color

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `accent` | #0066FF | 0, 102, 255 | Primary CTA, links, focus |
| `accent-hover` | #0052CC | 0, 82, 204 | Hover state |
| `accent-active` | #0041A3 | 0, 65, 163 | Active/pressed state |
| `accent-light` | #E6F0FF | 230, 240, 255 | Accent backgrounds |

### Semantic Colors (Use Sparingly)

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | #10B981 | Success states only |
| `warning` | #F59E0B | Warning indicators only |
| `error` | #EF4444 | Error states only |

### CSS Variables
```css
:root {
  --bg-page: #FAFAFA;
  --bg-surface: #FFFFFF;
  --bg-subtle: #F5F5F5;
  --text-primary: #0A0A0A;
  --text-secondary: #525252;
  --text-muted: #A3A3A3;
  --border-default: #E5E5E5;
  --border-subtle: #F0F0F0;
  --accent: #0066FF;
  --accent-hover: #0052CC;
  --accent-active: #0041A3;
  --accent-light: #E6F0FF;
}
```

---

## 4. Shadows

Soft, layered shadows for depth without heaviness.

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.04)` | Subtle elevation (buttons) |
| `shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.06)` | Cards, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.08)` | Modals, popovers |
| `shadow-xl` | `0 12px 40px rgba(0, 0, 0, 0.10)` | Hero cards, emphasis |
| `shadow-inner` | `inset 0 1px 2px rgba(0, 0, 0, 0.04)` | Input fields (pressed) |

### Tailwind Config
```js
boxShadow: {
  'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
  'md': '0 4px 12px rgba(0, 0, 0, 0.06)',
  'lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
  'xl': '0 12px 40px rgba(0, 0, 0, 0.10)',
  'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
}
```

---

## 5. Border Radii

Consistent, modern radii. No sharp corners on interactive elements.

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Buttons, badges |
| `radius-md` | 12px | Cards, inputs |
| `radius-lg` | 16px | Large cards, modals |
| `radius-xl` | 24px | Hero sections, featured |
| `radius-full` | 9999px | Pills, avatars |

### Tailwind Config
```js
borderRadius: {
  'sm': '6px',
  'md': '12px',
  'lg': '16px',
  'xl': '24px',
  'full': '9999px',
}
```

---

## 6. Motion & Animation

Subtle, purposeful motion. 60fps target. No gratuitous animation.

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration-micro` | 100ms | Opacity, color changes |
| `duration-fast` | 150ms | Button states, hover |
| `duration-normal` | 250ms | Standard transitions |
| `duration-slow` | 400ms | Number tweens, emphasis |
| `duration-slower` | 600ms | Page transitions |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-out` | `cubic-bezier(0.0, 0, 0.2, 1)` | Enter animations |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard, default |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, playful (rare) |

### Animation Rules

**DO:**
- Animate opacity for enter/exit
- Tween numbers smoothly (400ms ease-out)
- Use transform for movement (GPU accelerated)
- Animate border-color and box-shadow for focus

**DON'T:**
- Animate layout properties (width, height, margin)
- Use animation duration > 600ms
- Add animation to everything
- Block user interaction during animation

### Number Tween Animation
For price updates and counters:
```css
.price-value {
  transition: all 400ms cubic-bezier(0.0, 0, 0.2, 1);
  /* Use CSS counter or JS library for smooth number tweening */
}
```

### Tailwind Config
```js
transitionDuration: {
  'micro': '100ms',
  'fast': '150ms',
  'normal': '250ms',
  'slow': '400ms',
  'slower': '600ms',
},
transitionTimingFunction: {
  'out': 'cubic-bezier(0.0, 0, 0.2, 1)',
  'in': 'cubic-bezier(0.4, 0, 1, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}
```

---

## 7. Accessibility Requirements

Non-negotiable accessibility standards.

### Focus States
- All interactive elements MUST have visible focus states
- Focus ring: `2px solid var(--accent)` with `2px offset`
- Focus must be visible in both light and dark contexts

```css
.focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Touch Targets
- **Minimum**: 44px x 44px for all interactive elements
- Buttons, links, toggles, checkboxes must meet this

### Color Contrast
- Text on backgrounds must meet WCAG AA (4.5:1 for body, 3:1 for large)
- `text-primary` on `bg-page`: 19.5:1 (passes)
- `text-secondary` on `bg-page`: 6.4:1 (passes)
- `accent` on `bg-surface`: 4.6:1 (passes AA)

### Keyboard Navigation
- Tab order must be logical
- All functionality accessible via keyboard
- Skip links for main content
- Escape closes modals/dropdowns

---

## 8. Layout Constraints

### Max Widths

| Token | Value | Usage |
|-------|-------|-------|
| `max-w-content` | 720px | Article/reading content |
| `max-w-container` | 1280px | Page container |
| `max-w-wide` | 1440px | Full-width sections |

### Grid System
- 12-column grid for complex layouts
- CSS Grid preferred over Flexbox for page layout
- Gap: use spacing tokens (typically `space-6` or `space-8`)

### Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets, mobile landscape |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Standard desktops |
| `2xl` | 1536px | Large displays |

---

## 9. Do's and Don'ts

### DO
- Use generous whitespace (when in doubt, add more)
- Stick to the defined spacing scale
- Keep typography hierarchy clear
- Use accent color sparingly (CTAs only)
- Add subtle shadows for depth
- Ensure smooth 60fps animations

### DON'T
- Add arbitrary pixel values
- Use colors outside the palette
- Add heavy borders (use shadows instead)
- Animate layout properties
- Sacrifice accessibility for aesthetics
- Add multiple CTAs per screen
