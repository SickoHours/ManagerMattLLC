# Estimator System Prompt

This file documents the estimation logic used in `convex/ai.ts`.

## System Prompt Summary

The estimator analyzes PRDs and generates line-item cost estimates based on:
- $150/hr hourly rate (AI-accelerated development)
- $1,500 minimum project
- User type multipliers (0.8x to 1.4x)
- Timeline multipliers (1.0x to 1.15x)
- Risk buffers (10-20%)

## Estimation Guidelines by Story Type

| Type | Hours | Notes |
|------|-------|-------|
| Simple CRUD screen | 2-4 | Basic forms, lists |
| Login/Auth | 4-6 | Email/password |
| Team/User management | 6-10 | Invites, roles |
| Mobile screen | 4-8 | React Native |
| Dashboard/Analytics | 8-12 | Charts, data viz |
| Real-time feature | 6-10 | Live updates |
| GPS/Location | 6-10 | Maps, tracking |
| Payment integration | 8-12 | Stripe |
| AI feature | 10-16 | LLM integration |
| File upload/storage | 3-5 | S3, processing |
| Data sync | 4-6 | Between platforms |
| Notifications | 4-6 | Push/email |
| Search | 4-8 | Depends on complexity |
| Export/Reports | 4-8 | PDF, CSV |

## Output Format

```json
{
  "lineItems": [
    {
      "id": "US-001",
      "title": "Feature name",
      "hours": 6,
      "cost": 900,
      "confidence": "high"
    }
  ],
  "subtotal": 6150,
  "riskBuffer": 920,
  "riskPercent": 15,
  "total": { "min": 6150, "max": 7070 },
  "totalHours": 41,
  "confidence": "medium",
  "notes": ["Important assumptions or risks"]
}
```

## Confidence Levels

- **high**: Well-defined requirements, clear scope
- **medium**: Some unknowns, reasonable assumptions
- **low**: Significant unknowns, needs discovery

## Risk Percentages

- Simple projects: 10%
- Medium complexity: 15%
- Complex/AI projects: 20%

## Temperature

- Uses `temperature: 0.3` for consistent, accurate pricing

## Implementation

See `convex/ai.ts:estimateFromPRD` for the actual implementation.
