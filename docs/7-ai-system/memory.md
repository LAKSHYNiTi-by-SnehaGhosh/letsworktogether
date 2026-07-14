# AI Memory System

## Concept
For the illusion of a real workplace to hold, the AI must remember what the user did last week. If the AI Tech Lead scolded the user for not using TypeScript interfaces on Monday, it should reference that mistake if it happens again on Friday.

## Implementation (Phase 4)
- **Vector Database**: We store embeddings of AI reviews, standup submissions, and sprint results in Supabase (pgvector).
- **Retrieval Augmented Generation (RAG)**: Before generating a new review or chat response, the system queries pgvector for the user's top 3 most relevant historical interactions and injects them into the system prompt context.

This ensures the AI exhibits long-term memory and can track actual career progression.
