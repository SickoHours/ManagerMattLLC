# ManagerMattLLC Design System - Page Blueprints

> Layout and behavior specifications for the two hero screens.

---

## 1. Global Layout

### Page Container

```
Max Width: 1280px
Padding (horizontal):
  - Mobile: 16px (space-4)
  - Tablet: 24px (space-6)
  - Desktop: 32px (space-8)
Margin: auto (centered)
```

### Header (Global)

```
Height: 64px
Position: sticky, top: 0
Z-index: 50
Background: bg-surface (rgba(255,255,255,0.8) with backdrop-blur)
Border Bottom: transparent (default) → border-subtle (on scroll)
Transition: 150ms ease-in-out
```

**Contents:**
```
┌────────────────────────────────────────────────────────────────────┐
│  [Logo]              Home  Work  Process  Pricing       [Get Est.] │
└────────────────────────────────────────────────────────────────────┘
     ↑                        ↑                                ↑
   Left                    Center                           Right
   (logo)               (nav links)                     (Primary CTA)
```

**Mobile (< 768px):**
```
┌────────────────────────────────────────────────────────────────────┐
│  [Logo]                                                [☰] [CTA]   │
└────────────────────────────────────────────────────────────────────┘
```

### Footer (Global)

```
Background: text-primary (#0A0A0A)
Padding: 64px vertical (space-16)
Color: inverted
```

**Structure:**
```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   Manager Matt LLC              Product        Resources           │
│                                                                    │
│   AI-accelerated dev,           Home           Process            │
│   openly honest.                Work           Pricing            │
│                                 Estimate       Contact            │
│                                                                    │
│   ───────────────────────────────────────────────────────────────  │
│                                                                    │
│   © 2024 Manager Matt LLC       Privacy  Terms                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Home Page (`/`)

### Overview

A single-focus landing page that converts visitors into the estimate funnel.

**Key Metrics:**
- Primary CTA: "Get Your Estimate"
- Trust indicators: 3 pillars
- Time to CTA: immediate (above fold)

### Section Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                          [Header]                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         HERO SECTION                             │
│                        (96px top pad)                            │
│                                                                  │
│            Build products that matter.                           │
│               Faster. Clearer. Cheaper.                          │
│                                                                  │
│       AI-accelerated development with radically                  │
│           transparent estimates and delivery.                    │
│                                                                  │
│              [ Get Your Estimate → ]                             │
│                                                                  │
│                        (96px bottom pad)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                       TRUST SECTION                              │
│                       (64px padding)                             │
│                                                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │   [icon]    │  │   [icon]    │  │   [icon]    │             │
│   │             │  │             │  │             │             │
│   │  Explainable│  │ Fast Builds │  │  Control    │             │
│   │  Estimates  │  │             │  │  Room       │             │
│   │             │  │             │  │             │             │
│   │  See every  │  │  AI tools   │  │  Track      │             │
│   │  assumption │  │  reduce     │  │  progress,  │             │
│   │  and driver │  │  weeks to   │  │  approve    │             │
│   │             │  │  days       │  │  changes    │             │
│   └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│                        (64px bottom pad)                         │
├─────────────────────────────────────────────────────────────────┤
│                          [Footer]                                │
└─────────────────────────────────────────────────────────────────┘
```

### Hero Section Spec

```
Background: bg-page (#FAFAFA)
Padding: 96px top, 96px bottom (space-24)
Text Align: center
Max Width: 800px (content)
```

**Typography:**
| Element | Style | Token |
|---------|-------|-------|
| Headline | "Build products..." | display (72px), text-primary |
| Tagline | "Faster. Clearer..." | h2 (36px), text-secondary |
| Description | "AI-accelerated..." | body (16px), text-secondary, max-w 600px |
| CTA | Primary Button | 44px height, accent |

**Responsive (Mobile < 768px):**
- Headline: 48px (h1 token)
- Tagline: 28px
- Padding: 64px top/bottom

### Trust Section Spec

```
Background: bg-surface (#FFFFFF)
Padding: 64px top, 64px bottom (space-16)
```

**Grid:**
```
Desktop: 3 columns, 32px gap
Tablet: 3 columns, 24px gap
Mobile: 1 column, 24px gap
```

**Trust Card:**
```
Text Align: center
Icon: 48px, text-secondary
Title: h3 (24px), text-primary, margin-top 24px
Description: body-sm (14px), text-secondary, margin-top 8px
Max Width: 320px per card
```

### Home Page States

| State | Behavior |
|-------|----------|
| Default | Static content, no loading states needed |
| CTA Hover | Button hover state (shadow, darker) |
| CTA Click | Navigate to `/estimate` |

---

## 3. Estimate Page (`/estimate`)

### Overview

Multi-step wizard with live pricing summary. The core conversion flow.

**Key Behaviors:**
- Steps: Platform → Auth → Modules → Quality
- Sticky summary on desktop (right)
- Sticky pill on mobile (bottom)
- Live price updates with smooth tweening

### Desktop Layout (>= 1024px)

```
┌────────────────────────────────────────────────────────────────────┐
│                            [Header]                                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────┐  ┌───────────────────────┐  │
│  │                                   │  │                       │  │
│  │         WIZARD CONTENT            │  │    ORDER SUMMARY      │  │
│  │           (flex: 1)               │  │      (400px)          │  │
│  │                                   │  │                       │  │
│  │  ○ Platform  ○ Auth  ● Modules    │  │  Platform: Web        │  │
│  │                                   │  │  Auth: Roles          │  │
│  │  ┌─────────────────────────────┐  │  │  Modules: 4           │  │
│  │  │                             │  │  │                       │  │
│  │  │     Step Content            │  │  │  ─────────────────    │  │
│  │  │                             │  │  │                       │  │
│  │  │     [Selection Cards]       │  │  │  $8,000 – $12,000     │  │
│  │  │                             │  │  │  P10 – P90 range      │  │
│  │  │                             │  │  │                       │  │
│  │  └─────────────────────────────┘  │  │  [ Get Full Quote ]   │  │
│  │                                   │  │                       │  │
│  │  [ ← Back ]          [ Continue ] │  │  ─────────────────    │  │
│  │                                   │  │  🙋 Ask a human       │  │
│  └───────────────────────────────────┘  └───────────────────────┘  │
│                                                                     │
├────────────────────────────────────────────────────────────────────┤
│                            [Footer]                                 │
└────────────────────────────────────────────────────────────────────┘
```

**Layout Spec:**
```
Container: max-w-container (1280px), padding 32px
Gap: 48px between wizard and summary
Wizard: flex-1, min-width 0
Summary: 400px fixed width, sticky top 24px
```

### Mobile Layout (< 1024px)

```
┌────────────────────────────────────────┐
│              [Header]                   │
├────────────────────────────────────────┤
│                                        │
│  ○ Platform  ○ Auth  ● Modules  ○ Qual │
│                                        │
│  ┌────────────────────────────────┐    │
│  │                                │    │
│  │       Step Content             │    │
│  │                                │    │
│  │       [Selection Cards]        │    │
│  │       (stacked vertically)     │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  [ ← Back ]            [ Continue ]    │
│                                        │
│                                        │
│  (extra padding for sticky pill)       │
│                                        │
├────────────────────────────────────────┤
│ $8,000–$12,000         [View ▲]        │  ← Sticky bottom pill
└────────────────────────────────────────┘
```

**Layout Spec:**
```
Container: full width, padding 16px
Stepper: horizontal scroll if needed
Cards: full width, stacked
Bottom padding: 80px (for sticky pill)
Pill: fixed bottom 16px, margin 16px sides
```

### Wizard Steps

#### Step 1: Platform

**Question:** "Where will your product live?"

**Options (Selection Cards):**
| Option | Icon | Description |
|--------|------|-------------|
| Web | 🌐 | Browser-based application |
| Mobile | 📱 | iOS and Android apps |
| Both | 🔗 | Web + native mobile |

**Layout:** 3-column grid (desktop), 1-column (mobile)

#### Step 2: Auth Level

**Question:** "How will users log in?"

**Options:**
| Option | Icon | Description |
|--------|------|-------------|
| None | 🔓 | Public, no login required |
| Basic | 🔑 | Email/password, social login |
| Roles | 👥 | User roles and permissions |
| Multi-tenant | 🏢 | Organizations with members |

**Layout:** 2x2 grid (desktop), 1-column (mobile)

#### Step 3: Modules

**Question:** "What features do you need?"

**Options:** Multi-select grid of modules

**Categories:**
- Core (Dashboard, Analytics, Settings)
- Data (Database, API, File Storage)
- Communication (Email, Notifications, Chat)
- Payments (Checkout, Subscriptions, Invoices)
- AI (Text Gen, Image Gen, Embeddings)

**Layout:** 3-column grid (desktop), 2-column (tablet), 1-column (mobile)

**Module Card:**
```
┌─────────────────────────────────┐
│ [icon]              [checkbox]  │
│                                 │
│ Module Name                     │
│ Short description of the        │
│ module functionality.           │
│                                 │
│ [Category Badge]                │
└─────────────────────────────────┘
```

#### Step 4: Quality

**Question:** "What quality level do you need?"

**Options:**
| Option | Badge | Description | Typical Use |
|--------|-------|-------------|-------------|
| Prototype | P | Quick validation, may have rough edges | Internal demos, testing ideas |
| MVP | M | Production-ready core, limited scope | Initial launch, fundraising |
| Production | Prod | Full polish, scalability, edge cases | Revenue-generating products |

**Layout:** 3-column (desktop), stacked (mobile)

### Order Summary Panel

**Desktop Spec:**
```
Width: 400px
Position: sticky
Top: 88px (64px header + 24px gap)
Background: bg-surface
Border Radius: radius-lg (16px)
Shadow: shadow-lg
Padding: 32px (space-8)
```

**Content Structure:**
```
┌─────────────────────────────────────┐
│ Your Estimate                       │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Platform                    Web     │
│ Authentication           Roles      │
│ Modules                      4      │
│ Quality                    MVP      │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Estimated Range                     │
│                                     │
│    $8,000 – $12,000                 │
│    P10 – P90 confidence             │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ [ Get Your Full Quote ]             │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ 🙋 Questions? Ask a human           │
│                                     │
└─────────────────────────────────────┘
```

**Mobile Pill Spec:**
```
Position: fixed
Bottom: 16px
Left: 16px
Right: 16px
Height: 64px (collapsed)
Background: bg-surface
Border Radius: radius-lg (16px top corners, radius-md bottom)
Shadow: shadow-xl
Padding: 16px 20px
Z-index: 40
```

**Collapsed Content:**
```
┌─────────────────────────────────────────────────────────────────┐
│  $8,000 – $12,000                              [ View Details ▲ ] │
└─────────────────────────────────────────────────────────────────┘
```

**Expanded:** Full summary slides up (max-height 60vh)

### Estimate Page States

| State | Visual | Behavior |
|-------|--------|----------|
| Loading | Skeleton on summary | Initial page load |
| Idle | Normal display | Default state |
| Calculating | Skeleton on price, "Updating..." | After selection change |
| Error | Error banner | Failed calculation |
| Degraded | Warning banner + "Ask a human" | Low confidence |
| Complete | All steps done | Ready for quote |

### Price Update Animation

```
Trigger: Any selection change
Duration: 400ms
Easing: ease-out
Behavior:
  1. Current price fades slightly (opacity 0.5)
  2. Skeleton pulse appears briefly
  3. New price fades in with number tween
  4. No layout shift (stable container)
```

### Navigation Flow

```
/ → /estimate (CTA click)
     ↓
Step 1: Platform
     ↓ (Continue)
Step 2: Auth
     ↓ (Continue)
Step 3: Modules
     ↓ (Continue)
Step 4: Quality
     ↓ (Get Full Quote)
/estimate/results/:id (future)
```

**Navigation Buttons:**
```
Step 1: [ Continue → ] only
Step 2-4: [ ← Back ] + [ Continue → ]
Final: [ ← Back ] + [ Get Full Quote ]
```

---

## 4. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked cards, sticky pill |
| Tablet | 640-1023px | 2-column grids, stacked wizard, sticky pill |
| Desktop | >= 1024px | Full layout, side-by-side summary |
| Wide | >= 1280px | Max container width reached |

---

## 5. Accessibility Requirements

### Page-Level

- Skip link to main content
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA landmarks (main, nav, footer)
- Page title updates on step change

### Wizard-Specific

- Step announcements via aria-live
- Current step indicated with aria-current
- Selection cards as radio group (proper ARIA)
- Form validation with aria-describedby errors

### Focus Management

- Focus moves to step content on step change
- Focus trapped in mobile summary when expanded
- Return focus to trigger on summary collapse

---

## 6. Performance Requirements

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s (hero headline)
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

**Optimizations:**
- Static hero content (no data fetching)
- Skeleton states prevent layout shift
- Price calculations debounced (300ms)
- Images lazy-loaded below fold
