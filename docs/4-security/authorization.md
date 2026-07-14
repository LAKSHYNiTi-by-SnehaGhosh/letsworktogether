# Authorization (RBAC & RLS)

Authentication proves *who* you are. Authorization determines *what* you can do.

## Role-Based Access Control (RBAC)
Inside a simulated company (Organization), users have roles.
- `Junior Developer`: Can view tasks, submit code.
- `Project Manager` (User or AI): Can create tasks, move sprints.
These roles must be enforced in the Next.js Server Actions. Before mutating data, the Server Action must check the user's role in that organization.

## Row Level Security (RLS)
As a secondary layer, Supabase RLS policies enforce data isolation at the database level.
- Even if a Server Action incorrectly allows a read, the RLS policy will block it if the `user_id` does not belong to the `organization_id` of the row being queried.
- Every table MUST have RLS enabled.
