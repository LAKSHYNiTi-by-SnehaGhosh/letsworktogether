# Implementation Rules

To maintain enterprise-grade quality and ensure LWT functions as a realistic AI workplace, all engineers must adhere to the following implementation rules:

## 1. Zero Placeholder Business Logic
- Never use `// TODO: Implement later` for core business flows. If a feature is in the MVP, it must be fully implemented, including error states and edge cases.
- Do not mock database calls unless strictly in a testing environment. 

## 2. Strong Typing & Validation
- **TypeScript `any` is forbidden.** All types must be explicitly defined.
- Validate all incoming data (API requests, Server Actions, Form Submissions) using `zod`. Do not trust client input.

## 3. Graceful Error Handling
- Never throw unhandled exceptions that crash the client.
- Return structured error objects from Server Actions: `{ error: "Invalid organization ID" }`.
- Display user-friendly Toast notifications for errors, maintaining the premium UI feel.

## 4. Documentation First
- Before writing a complex module (e.g., the AI Code Review engine), the architecture must be documented in the `docs/` directory.

## 5. Clean Code & Separation
- Do not mix database access (`Supabase`) directly inside a React component. Use Server Actions or separated query functions.
- Keep components small. If a component exceeds 200 lines, it likely needs to be broken down.
