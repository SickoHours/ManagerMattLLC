# PRD Template

This file documents the PRD generation structure used in `convex/ai.ts`.

## PRD JSON Structure

```json
{
  "summary": "Brief 1-2 sentence project summary",
  "userStories": [
    {
      "id": "US-001",
      "title": "Short title (3-5 words)",
      "description": "As a [user type], I want to [action] so that [benefit]",
      "acceptanceCriteria": [
        "Specific testable criterion 1",
        "Specific testable criterion 2"
      ]
    }
  ],
  "functionalRequirements": [
    {
      "id": "FR-001",
      "description": "The system shall..."
    }
  ],
  "nonGoals": [
    "Things explicitly out of scope"
  ]
}
```

## Guidelines

### User Stories
- Generate 4-8 user stories that cover the core functionality
- Each story should be small enough to complete in 1-2 days
- Acceptance criteria must be specific and testable
- Use the format: "As a [user], I want to [action] so that [benefit]"

### Functional Requirements
- Include 3-6 functional requirements
- Use "The system shall..." statements
- Focus on behavior, not implementation

### Non-Goals
- List 2-4 non-goals to set clear boundaries
- Helps prevent scope creep
- Be explicit about what's NOT included

## Temperature

- Uses `temperature: 0.5` for consistent, structured output

## Implementation

See `convex/ai.ts:generatePRD` for the actual implementation.
