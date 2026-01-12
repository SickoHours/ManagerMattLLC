# Output Formats

This file documents the JSON schemas used by the AI system.

## Question Generation Output

```typescript
interface QuestionsResponse {
  questions: {
    id: number;
    question: string;
    options: {
      key: string;      // "A", "B", "C", "D"
      label: string;    // User-friendly option text
      emoji?: string;   // Optional emoji for visual scanning
    }[];
  }[];
}
```

## PRD Output

```typescript
interface PRDResponse {
  summary: string;
  userStories: {
    id: string;              // "US-001", "US-002", etc.
    title: string;           // Short descriptive title
    description: string;     // "As a [user], I want to [action]..."
    acceptanceCriteria: string[];  // Testable conditions
  }[];
  functionalRequirements: {
    id: string;              // "FR-001", "FR-002", etc.
    description: string;     // "The system shall..."
  }[];
  nonGoals: string[];        // What's NOT included
}
```

## Estimate Output

```typescript
interface EstimateResponse {
  lineItems: {
    id: string;          // Matches user story ID
    title: string;       // Feature name
    hours: number;       // Estimated hours
    cost: number;        // hours * $150
    confidence: string;  // "high" | "medium" | "low"
  }[];
  subtotal: number;      // Sum of all line item costs
  riskBuffer: number;    // Risk amount in dollars
  riskPercent: number;   // 10, 15, or 20
  total: {
    min: number;         // subtotal
    max: number;         // subtotal + riskBuffer
  };
  totalHours: number;    // Sum of all hours
  confidence: string;    // Overall confidence level
  notes: string[];       // Important assumptions or risks
}
```

## Convex Schema Mapping

These outputs map to the `projectInquiries` table:

| AI Field | Schema Field |
|----------|--------------|
| questions | generatedQuestions |
| PRD | prd |
| lineItems | lineItems |
| total.min | estimateMin |
| total.max | estimateMax |
| subtotal | estimateSubtotal |
| riskBuffer | estimateRiskBuffer |
| riskPercent | estimateRiskPercent |
| totalHours | estimateTotalHours |
| confidence | estimateConfidence |
| notes | estimateNotes |

## Answer Format

User answers are stored as a comma-separated string:
```
"1A, 2C, 3B, 4D"
```

Where the number is the question ID and the letter is the selected option key.
