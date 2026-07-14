# Database Architecture

LWT utilizes **PostgreSQL** hosted on **Supabase**.

## Access Strategy
We do not use Supabase primarily as a BaaS (Backend-as-a-Service) for client-side fetching.
- **95% of queries** run on the Server (Next.js Server Components / Actions) using a Service Role key or Authenticated client.
- **Row Level Security (RLS)** is strictly enforced to prevent accidental data leaks.

## Migrations and Schema Management
- All database changes must be tracked via standard SQL migration files.
- We rely on strict relational integrity (Foreign Keys, Constraints) rather than application-level enforcement.

## Multi-Tenancy Design
The platform groups users into `organizations` (Simulated AI Companies). Data separation is crucial:
- Every `project`, `task`, and `sprint` belongs to an `organization_id`.
- Users have an `organization_member` mapping to determine access levels (e.g., Junior Dev vs Tech Lead).
