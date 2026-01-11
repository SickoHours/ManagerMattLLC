# ManagerMattLLC Design System - Component Library

> All components follow the design tokens defined in `STYLE_GUIDE.md`. No exceptions.

---

## 1. Buttons

### Primary Button
The single most important action on a screen. **One per screen maximum.**

```
Visual: Solid accent background, white text
Height: 44px minimum (accessibility)
Padding: 16px 24px (space-4 space-6)
Border Radius: radius-sm (6px)
Font: 14px/16px, weight 500, uppercase tracking 0.04em
Shadow: shadow-sm on hover
```

**States:**
| State | Background | Text | Shadow |
|-------|------------|------|--------|
| Default | `accent` | white | none |
| Hover | `accent-hover` | white | shadow-sm |
| Active | `accent-active` | white | none |
| Focus | `accent` + focus ring | white | none |
| Disabled | `bg-subtle` | `text-muted` | none |

**Usage:**
- Primary CTA: "Get Your Estimate", "Continue", "Send Quote"
- One per screen section

### Secondary Button
Supporting actions, less emphasis than primary.

```
Visual: Transparent background, border, dark text
Height: 44px minimum
Padding: 16px 24px
Border: 1px solid border-default
Border Radius: radius-sm (6px)
Font: 14px/16px, weight 500
```

**States:**
| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | transparent | `border-default` | `text-primary` |
| Hover | `bg-subtle` | `border-default` | `text-primary` |
| Active | `bg-subtle` | `text-secondary` | `text-primary` |
| Focus | transparent + focus ring | `accent` | `text-primary` |
| Disabled | transparent | `border-subtle` | `text-muted` |

**Usage:**
- Secondary actions: "Learn More", "Skip", "Back"
- Cancel/dismiss actions

### Ghost Button
Minimal emphasis, typically for tertiary actions or navigation.

```
Visual: No background, no border, text only
Height: 44px minimum
Padding: 12px 16px
Font: 14px/16px, weight 500
```

**States:**
| State | Background | Text |
|-------|------------|------|
| Default | transparent | `text-secondary` |
| Hover | `bg-subtle` | `text-primary` |
| Active | `bg-subtle` | `text-primary` |
| Focus | focus ring only | `text-primary` |

**Usage:**
- Tertiary actions
- Navigation links styled as buttons
- "Ask a human" escape hatch

### Button Do's and Don'ts

**DO:**
- Use sentence case ("Get estimate" not "GET ESTIMATE")
- Keep labels short (2-4 words)
- Ensure 44px minimum touch target
- Add loading state for async actions

**DON'T:**
- Use multiple primary buttons on one screen
- Disable buttons without explanation
- Use vague labels ("Submit", "Click here")
- Animate button size on hover

---

## 2. Cards

### Surface Card
Standard content container with elevation.

```
Background: bg-surface (#FFFFFF)
Border: none
Border Radius: radius-md (12px)
Shadow: shadow-md
Padding: space-8 (32px)
```

**Variants:**
- **Default**: Static content display
- **Interactive**: Adds hover state (shadow-lg, translateY(-2px))
- **Selected**: Adds accent border (2px solid accent)

### Bordered Card
Lighter elevation, uses border instead of shadow.

```
Background: bg-surface
Border: 1px solid border-default
Border Radius: radius-md (12px)
Shadow: none
Padding: space-6 (24px)
```

**Usage:**
- Form sections
- Grouped options
- Secondary content

### Selection Card
For radio/checkbox group items styled as cards.

```
Background: bg-surface
Border: 1px solid border-default (unselected) / 2px solid accent (selected)
Border Radius: radius-md (12px)
Padding: space-6 (24px)
Min Height: 80px
Cursor: pointer
```

**States:**
| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | `border-default` | `bg-surface` | none |
| Hover | `border-default` | `bg-subtle` | shadow-sm |
| Selected | `accent` (2px) | `accent-light` | none |
| Focus | `accent` + focus ring | `bg-surface` | none |
| Disabled | `border-subtle` | `bg-subtle` | none |

**Usage:**
- Platform selection (Web, Mobile, Both)
- Quality tier selection (Prototype, MVP, Production)
- Module selection in wizard

---

## 3. Form Controls

### Text Input

```
Height: 44px
Padding: 12px 16px
Border: 1px solid border-default
Border Radius: radius-md (12px)
Font: body (16px)
Background: bg-surface
```

**States:**
| State | Border | Background |
|-------|--------|------------|
| Default | `border-default` | `bg-surface` |
| Hover | `text-secondary` | `bg-surface` |
| Focus | `accent` (2px) | `bg-surface` |
| Error | `error` | `bg-surface` |
| Disabled | `border-subtle` | `bg-subtle` |

### Toggle Switch

```
Width: 48px
Height: 28px
Border Radius: radius-full
Thumb Size: 24px
```

**States:**
| State | Track | Thumb |
|-------|-------|-------|
| Off | `border-default` | `bg-surface` |
| Off + Hover | `text-muted` | `bg-surface` |
| On | `accent` | `bg-surface` |
| On + Hover | `accent-hover` | `bg-surface` |
| Disabled | `bg-subtle` | `text-muted` |

### Slider

```
Track Height: 6px
Track Radius: radius-full
Thumb Size: 20px (visible) / 44px (touch target)
Active Track: accent
Inactive Track: border-default
```

**Features:**
- Value tooltip appears on hover/drag
- Smooth value updates (no jumps)
- Optional tick marks for discrete values

### Stepper (Progress Indicator)

```
Step Circle: 32px diameter
Step Number Font: label (12px), weight 600
Connector Line: 2px, border-default (incomplete) / accent (complete)
```

**Step States:**
| State | Circle | Number | Label |
|-------|--------|--------|-------|
| Incomplete | `border-default` border | `text-muted` | `text-muted` |
| Current | `accent` fill | white | `text-primary` |
| Complete | `accent` fill + check | white | `text-secondary` |

---

## 4. Order Summary Panel

### Desktop Version (Sticky Right)

```
Width: 400px
Position: sticky, top: 24px
Background: bg-surface
Border Radius: radius-lg (16px)
Shadow: shadow-lg
Padding: space-8 (32px)
```

**Structure:**
```
┌─────────────────────────────┐
│ Order Summary        [icon] │  <- Header (h4)
├─────────────────────────────┤
│ Platform          Web + iOS │  <- Line items
│ Auth Level           Roles  │
│ Modules                  12 │
│ Quality               MVP   │
├─────────────────────────────┤
│ Estimated Range             │  <- Price section
│                             │
│  $12,000 – $18,000         │  <- Price (h2, accent)
│  P10 – P90 confidence       │
├─────────────────────────────┤
│ [    Get Full Quote    ]    │  <- Primary CTA
└─────────────────────────────┘
```

**Behaviors:**
- Sticky positioning until footer
- Price updates with smooth tween animation (400ms)
- Skeleton loading state during calculation
- Collapsed state available on scroll (optional)

### Mobile Version (Sticky Bottom Pill)

```
Position: fixed, bottom: 0
Width: 100% - 32px (16px margin each side)
Height: 64px (collapsed) / auto (expanded)
Background: bg-surface
Border Radius: radius-lg (top only)
Shadow: shadow-xl
Margin Bottom: 16px (safe area)
```

**Collapsed State:**
```
┌────────────────────────────────────────┐
│ $12,000 – $18,000    [View Details ▲]  │
└────────────────────────────────────────┘
```

**Expanded State:**
- Slides up to show full summary
- Tap outside or chevron to collapse
- Max height: 60vh

---

## 5. Badges & Labels

### Status Badge

```
Height: 24px
Padding: 4px 12px
Border Radius: radius-full
Font: label-xs (11px), weight 500, uppercase
```

**Variants:**
| Variant | Background | Text |
|---------|------------|------|
| Default | `bg-subtle` | `text-secondary` |
| Info | `accent-light` | `accent` |
| Success | `#ECFDF5` | `success` |
| Warning | `#FFFBEB` | `warning` |
| Error | `#FEF2F2` | `error` |

### Category Label

```
Height: 20px
Padding: 2px 8px
Border Radius: radius-sm
Font: label-xs (11px), weight 500
Background: bg-subtle
Color: text-secondary
```

### Confidence Indicator

```
Display: inline-flex with icon
Icon: 16px circle (filled proportionally)
Font: body-sm (14px)
Color: text-secondary
```

**Visual:**
- Low (0-40): 1/4 filled, `warning` color
- Medium (41-70): 1/2 filled, `text-secondary`
- High (71-100): full filled, `success` color

---

## 6. Skeleton Loaders

Use skeletons for all loading states. Never show spinners or blank screens.

### Skeleton Base

```
Background: linear-gradient(
  90deg,
  #F5F5F5 25%,
  #EBEBEB 50%,
  #F5F5F5 75%
)
Animation: shimmer 1.5s ease-in-out infinite
Border Radius: radius-sm (6px)
```

### Skeleton Variants

**Text Line:**
```
Height: 16px (body) / 12px (label)
Width: varies (80%, 60%, 40% for natural look)
Margin Bottom: 8px
```

**Price Skeleton:**
```
Height: 44px
Width: 200px
Border Radius: radius-md
```

**Card Skeleton:**
```
Full card dimensions
Internal elements as skeleton lines
```

### Animation Keyframes
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 7. Navigation

### Header

```
Height: 64px
Background: bg-surface (with backdrop blur on scroll)
Border Bottom: 1px solid border-subtle (on scroll)
Position: sticky, top: 0
Z-index: 50
```

**Contents:**
- Logo (left)
- Nav links (center, desktop only)
- CTA button (right)

### Footer

```
Background: text-primary (#0A0A0A)
Padding: space-16 (64px) vertical
Color: inverted (white text)
```

---

## 8. Empty & Error States

### Empty State

```
Layout: centered, max-width 400px
Icon: 64px, text-muted
Heading: h3, text-primary
Description: body, text-secondary
Action: Secondary button (optional)
```

**Example:**
```
        [icon]
   No modules selected

   Add modules to your build
   to see an estimate.

   [ Browse Modules ]
```

### Error State

```
Background: #FEF2F2 (error light)
Border: 1px solid error
Border Radius: radius-md
Padding: space-4
```

**Contents:**
- Icon (error color, 20px)
- Message (body-sm, text-primary)
- Action link (optional)

### Degraded Mode

When confidence is too low or inputs are insufficient:

```
Background: #FFFBEB (warning light)
Border: 1px solid warning
Border Radius: radius-md
Padding: space-6
```

**Contents:**
- Warning icon
- Calm messaging (no scary language)
- "Ask a human" CTA prominent

---

## 9. Component Usage Rules

### Do's

1. **Consistency**: Use components exactly as specified
2. **Spacing**: Only use spacing tokens from style guide
3. **States**: Implement all states (hover, focus, active, disabled)
4. **Loading**: Always show skeletons, never blank states
5. **Accessibility**: 44px touch targets, visible focus states

### Don'ts

1. **Custom colors**: Never add colors outside the palette
2. **Custom spacing**: Never use arbitrary pixel values
3. **Missing states**: Never ship without hover/focus states
4. **Spinners**: Never use loading spinners
5. **Multiple CTAs**: Never have multiple primary buttons visible

---

## 10. Component Composition Examples

### Wizard Step Card
```jsx
<SelectionCard selected={isSelected} onClick={onSelect}>
  <div className="flex items-center gap-4">
    <Icon className="w-6 h-6 text-secondary" />
    <div>
      <h4 className="text-h4 text-primary">{title}</h4>
      <p className="text-body-sm text-secondary">{description}</p>
    </div>
  </div>
</SelectionCard>
```

### Price Display with Tween
```jsx
<div className="text-h2 text-accent">
  <AnimatedNumber value={minPrice} prefix="$" separator="," />
  <span className="text-secondary mx-2">–</span>
  <AnimatedNumber value={maxPrice} prefix="$" separator="," />
</div>
<p className="text-label text-muted">P10 – P90 confidence range</p>
```

### Module Selection Grid
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {modules.map(module => (
    <SelectionCard
      key={module.id}
      selected={selected.includes(module.id)}
      onClick={() => toggle(module.id)}
    >
      <Badge variant="info">{module.category}</Badge>
      <h4>{module.name}</h4>
      <p className="text-body-sm text-secondary">{module.description}</p>
    </SelectionCard>
  ))}
</div>
```
