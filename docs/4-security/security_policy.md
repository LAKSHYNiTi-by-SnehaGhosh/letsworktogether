# Security Policy

## Reporting a Vulnerability
If you discover a security vulnerability within LWT, please do not disclose it publicly.

Email us at `security@lakshyniti.com` with the details.

## Incident Response Plan
In the event of a data breach:
1. Identify the compromised vector (e.g., leaked Clerk key).
2. Rotate all affected API keys immediately via Vercel.
3. Lock down the Supabase database.
4. Notify affected users within 24 hours.
5. Conduct a post-mortem and update architecture to prevent recurrence.
