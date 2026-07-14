# Animations & Micro-Interactions

Animations in a professional tool must feel snappy, responsive, and purposeful. Overly bouncy or slow animations ruin the "enterprise" feel.

## Guidelines
- **Speed**: Animations should be fast (150ms - 200ms). The user is trying to execute work, not watch a movie.
- **Easing**: Use custom easing curves that start fast and end slow (e.g., `ease-out`).

## Framer Motion
We use `framer-motion` for complex layout transitions (e.g., moving a task card across a Sprint Kanban board).
- Keep `initial`, `animate`, and `exit` states simple.
- Use `layoutId` for smooth transitions of elements across the DOM.

## Tailwind Transitions
For simple hover states, use standard Tailwind transitions:
`transition-colors duration-200 ease-out hover:bg-accent`

## AI Thinking States
When the AI is evaluating code or generating a project, use subtle, non-distracting skeleton loaders or glowing gradient borders to indicate processing, rather than standard spinning wheels.
