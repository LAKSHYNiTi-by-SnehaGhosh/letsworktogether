# API Integrations

LWT relies on several critical external APIs.

## 1. Authentication (Clerk)
- **Use Case**: User signup, login, session management.
- **Integration**: `clerk/nextjs`. We rely on Clerk middleware to protect routes.
- **Webhook**: LWT exposes `/api/webhooks/clerk` to sync user data (creation/updates) into our PostgreSQL `users` table.

## 2. Artificial Intelligence (Gemini & OpenAI)
- **Use Case**: Generating projects, acting as AI Personas (CEO, PM), reviewing code.
- **Integration**: Server-side SDKs only. API keys must NEVER be exposed to the client.
- **Strategy**: 
  - Use OpenAI for rapid conversational logic (low latency).
  - Use Gemini for deep reasoning, long-context code evaluation, and complex JSON structured outputs (architectural planning).

## 3. Database (Supabase)
- **Use Case**: Relational data storage.
- **Integration**: `@supabase/supabase-js`. 
- **Clients**: Create standard helper files (`createClient()`) to securely instantiate the Supabase client in Server Components and Server Actions.

## API Route Design
Any RESTful API exposed by LWT (e.g., `/api/portfolio/[userId]`) must:
1. Validate input strictly with `zod`.
2. Check authorization via Clerk `auth()`.
3. Handle errors gracefully and return standardized JSON `{ error: "Message", code: 400 }`.
