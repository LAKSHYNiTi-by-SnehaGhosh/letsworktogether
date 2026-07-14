# Testing Strategy

## Philosophy
We prioritize testing core business logic and AI evaluations over brittle UI component tests.

## 1. Unit Testing (Vitest)
Used for isolated utility functions.
- e.g., Testing the function that calculates user XP based on sprint completion time.
- e.g., Testing the function that parses AI JSON responses.

## 2. Integration Testing
Used for Server Actions.
- Ensure that passing an invalid `organization_id` to `createTaskAction` fails correctly.
- Use a dedicated test database to mock these interactions.

## 3. End-to-End (E2E) Testing (Playwright)
Used for critical user journeys.
- User Login -> Select Project -> Start Sprint.
- We run a minimal set of E2E tests before every production deployment to ensure the "happy path" is unbroken.
