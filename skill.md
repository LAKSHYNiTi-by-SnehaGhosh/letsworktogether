# skill.md

## Technology Stack
- **Framework**: Next.js App Router, React 19
- **Language**: Strict TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Clerk
- **AI Models**: Gemini AI, OpenAI
- **Payments**: Stripe
- **Visuals**: Three.js, Recharts

## Engineering Standards
- **Clean Architecture & Feature-First Layout**: Structure code by feature rather than type.
- **SOLID Principles**: Adhere to strict object-oriented and functional principles.
- **No Placeholders**: Zero Placeholder Business Logic. All logic must be production-ready.
- **Server Components**: Prefer RSCs; keep client components to the absolute minimum needed for interactivity.

## UI/UX Standards
- **Premium Experience**: Linear, Notion, Vercel-level aesthetics.
- **Micro-Interactions**: Fluid, professional animations (nothing overly bouncy).
- **Responsive & Accessible**: Mobile-first, WCAG 2.2 compliant.
- **Themes**: Flawless Day and Dark theme support.

## Security Standards
- **OWASP Top 10**: Prevent injection, XSS, CSRF, etc.
- **RLS & RBAC**: Strict Row-Level Security in Supabase and Role-Based Access Control via Clerk.

## Documentation Requirements
- Every new feature, endpoint, or major component must be thoroughly documented in the `docs/` directory before implementation begins.
