# Deployment Strategy

LWT relies on **Vercel** for hosting the Next.js application, utilizing their edge network and serverless functions.

## Environments
- **Preview**: Every pull request generates a Vercel Preview Deployment connecting to a staging Supabase database.
- **Production**: Merges to `main` trigger a production build. This connects to the production Supabase database.

## CI/CD Pipeline (GitHub Actions)
Before a Vercel build can succeed, the following must pass:
1. `npm run lint` (ESLint)
2. TypeScript compilation (`tsc --noEmit`)
3. Unit and Integration tests.

## Database Migrations
Migrations are applied to the staging database on PR creation, and to the production database automatically post-merge using Supabase CLI GitHub Actions.
