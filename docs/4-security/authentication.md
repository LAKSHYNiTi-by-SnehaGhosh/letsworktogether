# Authentication

We use **Clerk** for all identity management.

## Clerk Setup
- We rely on `@clerk/nextjs` middleware to protect all routes under `/(dashboard)`.
- Users must not be able to access the dashboard without a valid Clerk session.

## Webhooks
We cannot rely solely on Clerk's servers for user data because we need relational links (e.g., assigning a Task to a User).
- We expose a webhook endpoint (`/api/webhooks/clerk`).
- When a user signs up, Clerk sends a `user.created` event.
- We capture this event and insert the user into our Supabase `users` table.

## Security
- Webhook signatures MUST be verified using `svix` to ensure payloads actually originated from Clerk.
