# Coding Guidelines

## SOLID Principles in React
While SOLID originated in OOP, the concepts apply deeply to our React architecture:
- **Single Responsibility Principle (SRP)**: A component should do one thing. If a `<TaskCard>` is fetching its own data, parsing AI feedback, and handling drag-and-drop, it violates SRP.
- **Open/Closed Principle (OCP)**: Components should be open for extension but closed for modification. Use `children` or render props to customize UI without rewriting the base component.
- **Dependency Inversion Principle (DIP)**: High-level UI should not depend on low-level fetching logic. Pass data as props or use custom hooks.

## Naming Conventions
- **Components**: PascalCase (e.g., `ProjectDashboard.tsx`).
- **Utility Functions**: camelCase (e.g., `calculateSprintVelocity.ts`).
- **Types/Interfaces**: PascalCase. Prefix interfaces with `I` only if strictly necessary, though preferring `type` or raw PascalCase `User` is standard in modern TS.
- **Environment Variables**: UPPER_SNAKE_CASE (e.g., `NEXT_PUBLIC_SUPABASE_URL`).

## File Structure per Component
```tsx
// Imports (External first, internal second)
import { useState } from "react";
import { cn } from "@/lib/utils";

// Types
interface TaskCardProps {
  taskId: string;
}

// Component
export function TaskCard({ taskId }: TaskCardProps) {
  return <div>...</div>;
}
```
