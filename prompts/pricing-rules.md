# Manager Matt Pricing Rules

This file defines the estimation guidelines used by the AI to calculate project costs.

## Base Rates

| Item | Rate | Notes |
|------|------|-------|
| Hourly Rate | $150/hr | AI-accelerated development |
| Minimum Project | $1,500 | Smallest viable engagement |
| Day Rate | $1,200/day | 8 productive hours |

## User Story Estimation Guidelines

| Story Type | Base Hours | Typical Cost | Notes |
|------------|------------|--------------|-------|
| Simple CRUD screen | 2-4 | $300-$600 | Basic forms, lists, detail views |
| Login/Authentication | 4-6 | $600-$900 | Email/password, sessions, forgot password |
| Team/User management | 6-10 | $900-$1,500 | Invites, roles, permissions |
| Mobile screen | 4-8 | $600-$1,200 | React Native component |
| Dashboard/Analytics | 8-12 | $1,200-$1,800 | Charts, metrics, data visualization |
| Real-time feature | 6-10 | $900-$1,500 | WebSocket, live updates |
| GPS/Location tracking | 6-10 | $900-$1,500 | Maps, geofencing, routes |
| Payment integration | 8-12 | $1,200-$1,800 | Stripe, subscriptions, invoicing |
| AI/LLM feature | 10-16 | $1,500-$2,400 | OpenAI, embeddings, chat |
| File upload/storage | 3-5 | $450-$750 | S3, image processing |
| Data sync | 4-6 | $600-$900 | Cross-platform, offline sync |
| Push notifications | 4-6 | $600-$900 | Mobile + web notifications |
| Search functionality | 4-8 | $600-$1,200 | Full-text, filters, sorting |
| Export/Reports | 4-8 | $600-$1,200 | PDF, CSV, scheduled reports |

## Functional Requirement Multipliers

| Requirement Type | Additional Hours |
|------------------|------------------|
| Offline support | +8-12 hours |
| Multi-language (i18n) | +4-6 hours |
| Accessibility (WCAG) | +4-8 hours |
| Complex animations | +2-4 hours |
| Third-party integrations | +4-8 per integration |

## User Type Multipliers

| User Type | Multiplier | Reasoning |
|-----------|------------|-----------|
| just-me | 0.8x | Simpler requirements, less polish needed |
| team | 1.0x | Standard internal tool |
| customers | 1.2x | Needs polish, error handling, edge cases |
| everyone | 1.4x | Most complex, must handle all scenarios |

## Timeline Multipliers

| Timeline | Multiplier | Notes |
|----------|------------|-------|
| exploring | 1.0x | Standard timeline |
| soon | 1.0x | Normal priority |
| asap | 1.15x | Rush premium (15%) |

## Risk Buffer Guidelines

| Project Complexity | Risk Buffer | When to Apply |
|--------------------|-------------|---------------|
| Simple | 10% | Well-defined, similar to past work |
| Medium | 15% | Some unknowns, typical project |
| Complex | 20% | AI features, many integrations, new tech |
| High Uncertainty | 25% | Vague requirements, experimental |

## Confidence Levels

| Level | Definition |
|-------|------------|
| high | Well-defined requirements, clear scope, similar past projects |
| medium | Some ambiguity, but reasonable assumptions can be made |
| low | Significant unknowns, recommend discovery call |

## Estimation Output Format

```json
{
  "lineItems": [
    {
      "id": "US-001",
      "title": "Team Login",
      "hours": 6,
      "cost": 900,
      "confidence": "high"
    }
  ],
  "subtotal": 6150,
  "riskBuffer": 920,
  "riskPercent": 15,
  "total": {
    "min": 6150,
    "max": 7070
  },
  "totalHours": 41,
  "confidence": "medium",
  "notes": [
    "GPS accuracy depends on device capabilities",
    "Real-time sync requires stable internet connection"
  ]
}
```

## Examples

### Simple Project (Just Me)
- Door knock logger for personal use
- 3 user stories, ~15 hours
- Base: $2,250 × 0.8 = $1,800
- Risk (10%): $180
- **Total: $1,800 - $1,980**

### Medium Project (Team)
- Sales team tracking app
- 6 user stories, ~35 hours
- Base: $5,250 × 1.0 = $5,250
- Risk (15%): $788
- **Total: $5,250 - $6,038**

### Complex Project (Customers + ASAP)
- Customer-facing marketplace
- 10 user stories, ~60 hours
- Base: $9,000 × 1.2 × 1.15 = $12,420
- Risk (20%): $2,484
- **Total: $12,420 - $14,904**
