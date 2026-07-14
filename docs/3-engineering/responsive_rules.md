# Responsive Design Rules

LWT is an enterprise application, which means it will predominantly be used on desktop monitors. However, responsive design is strictly enforced.

## Breakpoints (Tailwind Defaults)
- `sm`: 640px (Mobile landscape)
- `md`: 768px (Tablets)
- `lg`: 1024px (Laptops)
- `xl`: 1280px (Desktop)
- `2xl`: 1536px (Large Monitors)

## Strategy: Mobile-First CSS
Write base CSS for mobile, then use breakpoint prefixes for larger screens.
```tsx
// Correct
<div className="flex flex-col md:flex-row gap-4">
```

## Desktop Optimization
Because this is a complex workspace (Sprint boards, code editors, split panes):
- On mobile, deeply complex UI (like a Kanban board) may degrade into a vertical list.
- Do not compromise the desktop experience to make mobile work. Desktop is the primary execution environment.
