# Projects

## Concept
A Project in LWT represents a major feature initiative for a Simulated Company.
- e.g., "Implement Stripe Subscriptions for the SaaS App."
- e.g., "Build a HIPAA-compliant chat interface for the Health App."

## AI Generation
The AI (Gemini) generates the project brief, including:
1. **Business Requirements**: Why is the company building this?
2. **Technical Requirements**: What stack and architecture are expected?
3. **Milestones**: Breakdown into 2-week sprints.

## Implementation
Projects are stored in the `projects` table and linked to an `organization_id`. The user dashboard allows users to view the overarching project goals before diving into the specific Sprint board.
