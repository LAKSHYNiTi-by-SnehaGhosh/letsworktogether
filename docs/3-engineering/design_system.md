# Design System

LWT targets an ultra-premium aesthetic comparable to Linear, Notion, or Vercel.

## Core Philosophy
- **Minimalism & Focus**: Reduce visual noise. Let the content (the Sprint, the Code Review) be the focal point.
- **Typography**: High legibility. We use Geist (Vercel's font) as the primary typeface.
- **Borders & Shadows**: Use subtle borders (`border-border`) and soft shadows (`shadow-sm`) to define depth, avoiding harsh contrasts.

## Color Palette (Tailwind)
Our theme is driven by CSS variables in `globals.css` and applied via Tailwind.
- `bg-background`: Pure white in day mode, deep off-black (`#0a0a0a`) in dark mode.
- `text-foreground`: High contrast text.
- `text-muted-foreground`: For secondary information (timestamps, minor labels).
- `bg-primary`: The primary brand accent color.

## Dark Mode
Dark mode is **not an afterthought**. It must be explicitly designed and tested. 
- Avoid pure black (`#000000`) for large backgrounds to reduce eye strain.
- Ensure text contrast ratios meet WCAG AA standards in both Day and Dark themes.

## Spacing
Use a consistent 4-point grid.
- Small gaps: `gap-2` (8px), `gap-4` (16px).
- Sections: `py-8` (32px), `py-16` (64px).
