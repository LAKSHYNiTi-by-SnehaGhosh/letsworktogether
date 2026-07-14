# Environment Variables

LWT requires several environment variables to function. **Never commit `.env` files.**

## Required Variables
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # NEVER EXPOSE TO CLIENT

# AI
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Type Checking
We use `t3-env` or a custom `env.ts` file with Zod to validate that all required environment variables are present at build time, preventing unexpected runtime crashes.
