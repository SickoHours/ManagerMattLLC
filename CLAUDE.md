# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Manager Matt LLC is a software development agency website with an automated project estimation tool. The application allows potential clients to configure their project requirements through a wizard interface and receive real-time price estimates calculated using Monte Carlo simulation.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Backend**: Convex (real-time database and backend functions)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **PDF Generation**: @react-pdf/renderer for quote documents

## Commands

```bash
npm run dev      # Start development server (Next.js + Convex)
npm run build    # Production build
npm run lint     # Run ESLint
npx convex dev   # Run Convex dev server (if not auto-started)
```

To seed the database with module catalog and rate cards:
```bash
npx convex run seed:seedAll
```

## Architecture

### Estimation Engine (`convex/lib/estimator.ts`)

The core pricing logic uses Monte Carlo simulation (~600 runs) to generate P10/P50/P90 price percentiles. Key concepts:

- **BuildSpec**: User selections (platform, auth level, modules, quality, integrations, urgency, iteration)
- **Module Catalog**: Predefined modules with base hours, tokens, and risk weights stored in Convex
- **Rate Cards**: Pricing configuration (hourly rate, token rates, markup) stored in Convex
- **Price Formula**: `Total = MaterialsCost + LaborCost + RiskBuffer`
  - MaterialsCost = (tokens_in × rate_in + tokens_out × rate_out) × markup
  - LaborCost = hours × hourlyRate
  - RiskBuffer = f(uncertainty, risk weight)

"Unknown" selections trigger triangular distribution sampling to widen estimate ranges and reduce confidence scores.

### Convex Backend (`convex/`)

- `schema.ts`: Database schema (estimates, quotes, moduleCatalog, rateCards)
- `estimates.ts`: Mutations/queries for creating and retrieving estimates
- `quotes.ts`: Quote creation with shareable links and email capture
- `seed.ts`: Seeds module catalog and rate cards from mock data

### Frontend Components (`src/components/`)

- `estimate/wizard.tsx`: Multi-step wizard with live price preview via Convex subscription
- `estimate/mini-wizard.tsx`: Simplified version with template presets
- `estimate/results-summary.tsx`, `cost-breakdown.tsx`, `pricing-formula.tsx`: Results display
- `estimate/quote-form.tsx`: Email capture to convert estimates to quotes
- `pdf/quote-pdf.tsx`: PDF document generation using @react-pdf/renderer

### Page Routes (`src/app/`)

- `/`: Landing page with hero and mini-wizard
- `/estimate`: Full estimation wizard
- `/estimate/results/[estimateId]`: Estimate results with quote form
- `/q/[shareId]`: Public shareable quote page
- `/api/quote/[shareId]/pdf`: PDF generation endpoint
- `/pricing`, `/process`, `/work`, `/contact`: Public marketing pages

### Data Flow

1. User completes wizard steps in `wizard.tsx`
2. `api.estimates.preview` query provides live price updates as user configures
3. On "Get Quote", `api.estimates.create` mutation runs Monte Carlo simulation
4. Results page displays estimate with cost breakdown and assumptions
5. User enters email to create quote via `api.quotes.create`
6. Quote gets shareable URL (`/q/[shareId]`) and optional PDF download

### Degraded Mode (PRD Section 12.2)

Estimates enter "degraded mode" when:
- Confidence score < 40%
- 3+ "unknown" selections
- Complex modules with architect review triggers
- Complex integrations + exploratory iteration

Degraded mode shows warning banner recommending human consultation.
