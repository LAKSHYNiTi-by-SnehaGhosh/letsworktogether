# Backend Architecture

LWT utilizes a **Serverless BFF (Backend-For-Frontend)** architecture powered by Next.js Server Actions and Route Handlers.

## Server Actions
All data mutations (POST, PUT, DELETE) from the frontend MUST be handled via Server Actions. 
- Actions must be strongly typed using `zod`.
- Actions must verify the user's authentication and authorization state via Clerk before executing any database logic.
- Actions should ideally return a standard response object: `{ success: boolean, data?: any, error?: string }`.

## Route Handlers (`app/api/`)
Use API Routes only for:
1. **Webhooks**: Clerk user sync, Stripe payment events.
2. **Third-Party Callbacks**: OAuth redirects.
3. **Public APIs**: If LWT exposes data to external services (e.g., Portfolio embedding).

## External Services Integration
- **Database Connection**: We use the Supabase JS client for direct database interactions, relying on standard PostgreSQL patterns.
- **AI Clients**: Encapsulated within `src/features/ai/services/`. Do not bleed AI SDK logic into UI components.
