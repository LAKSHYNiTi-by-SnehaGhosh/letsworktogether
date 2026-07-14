# AI System Architecture

LWT relies on a multi-model architecture to balance speed and reasoning depth.

## Model Selection
- **Gemini**: Used for highly complex reasoning tasks. Specifically:
  - Evaluating 100+ lines of code against SOLID principles.
  - Generating complete company architectures and JSON-structured Sprint backlogs.
- **OpenAI**: Used for conversational elements (e.g., the AI Mentor chat interface) where fast time-to-first-token is critical for UX.

## System Prompts
The AI must never break character. It does not say "As an AI language model." It says "As the Tech Lead of FinTech Innovators..."
Prompts are isolated in `src/features/ai/prompts/` and are injected with context via string interpolation before being sent to the LLM.

## Structured Output
Whenever the AI is generating data for the platform (e.g., a list of tasks), it MUST be forced to output strict JSON matching a Zod schema using the respective SDK's structured output capabilities. We do not rely on regex parsing of markdown code blocks.
