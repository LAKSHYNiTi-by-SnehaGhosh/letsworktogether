# Folder Structure

We strictly adhere to a **Feature-First** structure. Code is organized by its business domain, not by its technical type (e.g., we do not group all hooks in one global `hooks` folder).

## The `src/` Directory
```text
src/
├── app/                  # Next.js App Router (Routing only)
│   ├── (auth)/           # Route group for authentication
│   ├── (dashboard)/      # Route group for authenticated dashboard
│   ├── api/              # API Routes (Webhooks, etc.)
│   └── layout.tsx
├── features/             # Business domains (The core of LWT)
│   ├── auth/             # Clerk integration, auth forms
│   ├── projects/         # Project generation, selection
│   ├── tasks/            # Sprint tasks, Kanban board
│   ├── ai/               # AI Engine, Personas, Prompts
│   └── portfolio/        # Portfolio generation and public view
├── components/           # Global, shared UI components
│   ├── ui/               # shadcn/ui components (Buttons, Inputs)
│   └── shared/           # Shared layouts, navigations
├── lib/                  # Global utilities and configurations
│   ├── supabase/         # Database clients
│   ├── utils.ts          # Tailwind merge utilities
│   └── types.ts          # Global generic types
└── styles/               # Global CSS
```

## Structure of a Feature
Inside `src/features/[feature-name]/`, the structure is:
```text
features/tasks/
├── components/           # Feature-specific UI
├── actions/              # Server Actions (Mutations)
├── queries/              # Data fetching functions (Server Components)
├── utils/                # Feature-specific helpers
└── types.ts              # Feature-specific types/interfaces
```
