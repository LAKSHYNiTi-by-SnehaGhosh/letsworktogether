# Security Posture

LWT treats security as a core feature, not an afterthought. Because we simulate professional organizations, user data and AI evaluations are highly sensitive.

## Core Tenets
1. **Never Trust the Client**: All data from the client is treated as hostile until validated.
2. **Least Privilege**: Users only have access to the data required for their specific role in their specific simulated organization.
3. **Defense in Depth**: We use Clerk for Authentication, but we re-verify authorization in Server Actions, and rely on Supabase Row Level Security (RLS) as the final backstop.

## Code Evaluation Safety
When users submit code for the AI to review:
- Do not blindly execute user code on the server.
- The AI merely evaluates the string content of the code submission against a rubric.
- Any future execution environments must be heavily sandboxed (e.g., using WebAssembly or isolated Docker containers).
