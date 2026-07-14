# Performance Optimization

To maintain the illusion of a fast-paced professional company, the platform must be blazing fast.

## Next.js Optimizations
- **Image Optimization**: Always use `next/image` for avatars, logos, and generated assets to prevent layout shift (CLS) and reduce bandwidth.
- **Font Optimization**: Use `next/font` to avoid render-blocking web fonts.

## Data Fetching
- **Caching**: Utilize Next.js data cache for relatively static data (e.g., Organization details).
- **Parallel Fetching**: When a dashboard requires data from 4 different tables, fetch them in parallel using `Promise.all` in the Server Component.
- **Suspense Boundaries**: Wrap slow-loading server components (like heavy AI evaluations) in `<Suspense fallback={<Skeleton />}>` so the rest of the page renders instantly.

## Bundle Size
- Avoid heavy client-side libraries.
- Dynamically import (`next/dynamic`) heavy components (like 3D visualizers or complex charts) only when they are needed.
