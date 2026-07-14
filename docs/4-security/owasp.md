# OWASP Top 10 Mitigations

LWT adheres to the OWASP Top 10 to ensure a robust security posture.

## 1. Broken Access Control
- **Mitigation**: Strict RLS in Supabase. RBAC checks on every Next.js Server Action.

## 2. Cryptographic Failures
- **Mitigation**: All data in transit uses TLS 1.3. API Keys (OpenAI, Gemini, Supabase Service Role) are stored securely in Vercel Environment Variables and never exposed to the client.

## 3. Injection
- **Mitigation**: Supabase uses parameterized queries by default. No raw SQL concatenation.

## 4. Insecure Design
- **Mitigation**: Threat modeling during the architecture phase. Security policies documented here.

## 5. Security Misconfiguration
- **Mitigation**: Enforce secure defaults in Next.js (e.g., strict Content-Security-Policy headers in `next.config.ts`).

## 6. Vulnerable and Outdated Components
- **Mitigation**: Dependabot alerts enabled. Regular `npm audit` checks.

*...and so on for all 10 categories.*
