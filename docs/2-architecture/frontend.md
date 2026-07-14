# Frontend Architecture

LWT is built on Next.js with the App Router, utilizing React 19.

## React Server Components (RSC)
By default, all components are Server Components. 
- You MUST fetch data directly within the Server Component (no `useEffect` or `useQuery` for initial data loads).
- Server Components provide maximum performance and SEO benefits.

## Client Components (`"use client"`)
Only use `"use client"` when absolutely necessary. Examples include:
- Components requiring interactivity (buttons, forms, modals).
- Components requiring browser APIs (`window`, `localStorage`).
- Components using React hooks (`useState`, `useEffect`).

*Rule of thumb: Push the `"use client"` directive as far down the component tree as possible.*

## State Management
- **URL State**: Prefer using query parameters for global state (e.g., active tab, filters, search query) so URLs are shareable.
- **React Context / Zustand**: Only use for complex, highly interactive global states that cannot be solved by URL parameters (e.g., an active real-time AI conversation context).
- **Server State**: Managed natively by Next.js RSCs and Server Actions. Do not use React Query unless doing heavy client-side polling.
