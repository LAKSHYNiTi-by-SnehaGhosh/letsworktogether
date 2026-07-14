# Database Schema (Core)

Below is the foundational relational schema required for LWT MVP 1.0.

## Tables

### `users`
Synced with Clerk via webhooks.
- `id` (UUID, PK) - Maps to Clerk user_id
- `email` (String)
- `first_name` (String)
- `last_name` (String)
- `xp` (Integer) - Gamification / Leveling system
- `created_at` (Timestamp)

### `organizations`
The simulated companies (e.g., "FinTech AI", "HealthTech Innovators").
- `id` (UUID, PK)
- `name` (String)
- `industry` (String)
- `created_at` (Timestamp)

### `projects`
Projects created by the AI for organizations.
- `id` (UUID, PK)
- `org_id` (UUID, FK -> organizations)
- `title` (String)
- `description` (Text)
- `status` (Enum: 'planning', 'active', 'completed')
- `created_at` (Timestamp)

### `tasks`
The Sprint tickets.
- `id` (UUID, PK)
- `project_id` (UUID, FK -> projects)
- `assigned_to` (UUID, FK -> users)
- `title` (String)
- `description` (Text)
- `status` (Enum: 'todo', 'in_progress', 'review', 'done')
- `ai_feedback` (Text) - Populated post-submission
- `created_at` (Timestamp)
