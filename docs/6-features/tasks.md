# Tasks & Sprint Boards

## Concept
Tasks are the granular units of execution. They simulate Jira tickets.

## The Workflow
1. **Generation**: The AI PM generates a backlog of tasks for the current sprint.
2. **Assignment**: The user drags a task from `To Do` to `In Progress`.
3. **Execution**: The user works on the task in their local IDE.
4. **Submission**: The user submits their work (a PR link, code snippet, or UI mockup) via the task card.
5. **Review**: The task moves to `In Review`. The AI Tech Lead evaluates the submission.
6. **Completion**: If approved, it moves to `Done`. If rejected, it moves back to `In Progress` with strict feedback.

## Data Schema
Tasks require a `status` enum (`todo`, `in_progress`, `review`, `done`), an `assigned_to` field, and an `ai_feedback` text field.
