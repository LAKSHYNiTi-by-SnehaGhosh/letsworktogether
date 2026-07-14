# Monitoring & Observability

To maintain enterprise-grade reliability, LWT must be continuously monitored.

## Error Tracking (Sentry)
- Sentry is integrated into both the Client and Server environments.
- Any unhandled exception in a Server Action or a client crash triggers an alert.
- Source maps are uploaded to Sentry during Vercel builds to ensure readable stack traces.

## Performance Monitoring
- Vercel Speed Insights monitors Core Web Vitals (LCP, FID, CLS) in real-time.
- If LCP drops below the "Good" threshold (< 2.5s), we investigate image loading and server response times.

## AI Latency
- We log the response times of the Gemini and OpenAI APIs. If AI evaluations take longer than 10 seconds, we show specialized "AI Thinking" loading states to the user to prevent perceived timeouts.
