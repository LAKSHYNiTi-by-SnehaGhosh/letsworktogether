# Component Library

LWT uses **shadcn/ui** as the foundational component library, styled with Tailwind CSS.

## Adding Components
Do not build complex base components (like Select, Dialog, or Dropdown) from scratch. 
Use the CLI:
`npx shadcn-ui@latest add [component-name]`

## Customization
shadcn/ui components are downloaded directly into `src/components/ui/`. 
- You are free to modify the source code of these components to match the LWT aesthetic perfectly.
- Ensure all modifications respect the `cn()` utility to allow overrides via `className`.

## Accessibility (a11y)
shadcn/ui is built on top of Radix UI primitives, meaning aria-labels, keyboard navigation, and focus trapping are handled automatically.
- Do not break these accessibility features when styling.
- Always test interactive components with keyboard-only navigation.
