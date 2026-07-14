# Billing Strategy

LWT uses **Stripe** for all billing and subscription management.

## Integration
- Handled via `stripe-node`.
- Webhooks (`/api/webhooks/stripe`) are used to listen for `invoice.payment_succeeded` and update the user's subscription status in the Supabase database.

## Plan Structures
The platform operates on a freemium/SaaS model. Specific tiers are defined in `pricing.md`.

## Data Model
- We add a `stripe_customer_id` to the `users` table.
- A `subscriptions` table tracks active status, tier level, and current period end dates.
