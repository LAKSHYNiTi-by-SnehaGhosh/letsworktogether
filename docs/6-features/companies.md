# Simulated Companies (Organizations)

## Concept
Users do not work on "independent projects." They join simulated organizations. 
When a user signs up, they choose an industry (e.g., FinTech, Healthcare, E-Commerce). The AI generates a complete company profile:
- Company Name & Logo (via AI image generation).
- Business Goals and active user base size (for realistic scale).
- Existing tech stack.

## Data Structure
The `organizations` table stores this metadata. Users belong to organizations via `organization_members`.

## UX Flow
When a user switches organizations, the UI completely changes its context. The AI team members introduce themselves based on the company's culture (e.g., a FinTech AI CEO will be strict about security, while an EdTech AI CEO might focus on accessibility).
