# High-Level Architecture

LWT follows a **Feature-First Clean Architecture**, designed for extreme scalability and separation of concerns.

## System Overview
- **Frontend**: Next.js App Router (React 19). Heavily reliant on React Server Components (RSCs) to minimize client-side javascript.
- **Backend**: Next.js API Routes and Server Actions serving as the BFF (Backend-for-Frontend).
- **Authentication**: Clerk (stateless, JWT-based, handling RBAC).
- **Database**: PostgreSQL (hosted on Supabase) utilizing Row Level Security (RLS) for data protection.
- **AI Engine**: A dual-model approach utilizing Gemini (for complex reasoning and code evaluation) and OpenAI (for fast conversational aspects).

## The AI Emulation Layer
Unlike standard SaaS tools, the AI does not sit behind a "chat window." The AI is integrated directly into the core workflows:
- **Event-Driven AI**: Submitting a task triggers an asynchronous AI code review pipeline.
- **Context Management**: AI personas share a centralized "Memory" database table to retain context about a user's performance across sprints.

## Key Principles
1. **Zero Placeholder Logic**: Every endpoint, component, and utility function must be production-ready.
2. **Server-First**: If logic can be evaluated on the server, it MUST be evaluated on the server.
3. **Decoupled Features**: `src/features/` contains isolated domains (auth, projects, dashboard).
