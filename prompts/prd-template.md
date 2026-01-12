# PRD Template

This file documents the PRD generation structure used in `convex/ai.ts`.

## System Prompt (Optimized for Token Efficiency)

The actual prompt used in production is compressed (~280 tokens vs ~330 original):

```
Create a PRD from project description and Q&A answers.

Return JSON: {"summary":"1-2 sentences","userStories":[{"id":"US-001","title":"Short title","description":"As a [user], I want [action] so that [benefit]","acceptanceCriteria":["testable criterion"]}],"functionalRequirements":[{"id":"FR-001","description":"The system shall..."}],"nonGoals":["out of scope items"]}

Generate 4-8 user stories (1-2 day size each), 3-6 functional requirements, 2-4 non-goals.
```

## PRD JSON Structure (Reference)

```json
{
  "summary": "Brief 1-2 sentence project summary",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short title",
      "description": "As a [user], I want [action] so that [benefit]",
      "acceptanceCriteria": ["Specific testable criterion"]
    }
  ],
  "functionalRequirements": [
    { "id": "FR-001", "description": "The system shall..." }
  ],
  "nonGoals": ["Things explicitly out of scope"]
}
```

## Guidelines (Reference)

- **User Stories**: 4-8 stories, 1-2 day size each, testable criteria
- **Functional Requirements**: 3-6 requirements, "The system shall..." format
- **Non-Goals**: 2-4 items to set clear boundaries

## Temperature

- Uses `temperature: 0.5` for consistent, structured output

## Implementation

See `convex/ai.ts:generatePRD` for the actual implementation.
