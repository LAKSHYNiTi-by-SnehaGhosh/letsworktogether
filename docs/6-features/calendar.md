# Calendar & Meetings

## Concept
Professional work is constrained by time. The LWT calendar enforces deadlines and simulates synchronous meetings.

## Features (Phase 3)
- **Daily Standups**: A required daily check-in (form submission) detailing blockers and progress.
- **Sprint Deadlines**: Sprints have hard end dates. If tasks are not completed, they roll over, negatively affecting the user's performance score.
- **AI Syncs**: Scheduled text-based "meetings" with the AI Tech Lead to discuss architecture before beginning a complex task.

## Implementation
Requires a cron job (via Vercel Cron or Supabase Edge Functions) to automatically end sprints and calculate rollover penalties at midnight UTC on the sprint end date.
