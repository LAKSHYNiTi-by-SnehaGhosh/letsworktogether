# Notifications

## Concept
A professional relies on notifications (Slack, Jira, Email). LWT simulates this high-signal environment.

## Types of Notifications
- **In-App Toast**: Real-time feedback (e.g., "Your PR was reviewed by the Tech Lead").
- **Inbox/Notification Center**: Persistent list of mentions, assigned tasks, and sprint updates.
- **Email Alerts**: (Phase 3) Actual emails sent to the user when a critical bug is reported by the AI QA in their deployed code, simulating an on-call emergency.

## Implementation
In-app notifications are stored in a `notifications` table linked to the `user_id`. Real-time updates can be handled via Supabase Realtime (WebSockets) to ensure the UI feels alive.
