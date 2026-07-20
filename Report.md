# Project Report: Let's Work Together (LWT)

This report provides a detailed overview of the LWT (Let's Work Together) project's current state, existing features, technology stack, and other key details.

## 1. Existing Features
The platform currently includes the following core features:
- **AI Workforce:** Role-specific AI personalities (e.g., AI CEO, PM, Tech Lead) that evaluate code, design, and overall execution.
- **Enterprise Emulation:** Users can join simulated organizations across different sectors (SaaS, FinTech, Healthcare, etc.).
- **Sprint & Task Execution:** Professional workflows, daily standups, and performance tracking systems.
- **Portfolio Generation:** Automated generation of professional portfolios based on real execution metrics.
- **Authentication & Security:** Secure login/registration via Clerk Auth with robust Enterprise Role-Based Access Control (RBAC).
- **Multi-Tenancy:** Comprehensive Organization and Team management architecture.
- **3D Visuals:** Dynamic 3D environments rendered using Three.js and React Three Fiber.
- **Database & Storage:** PostgreSQL database (Neon Serverless) and seamless file storage integration with Cloudflare R2 / AWS S3.

## 2. Potential Future Features
To further enhance the platform, the following features could be implemented in the future:
- **Real-time Collaboration:** Real-time chat and collaborative workspaces using WebSockets.
- **GitHub / GitLab Integration:** Direct repository integration for AI Code Reviews and automated feedback.
- **Advanced Analytics Dashboard:** Detailed analytics for tracking user performance and sprint progress.
- **Payment Gateway / Billing:** Subscription models (Pro/Enterprise tiers) integrated with Stripe or a similar payment gateway.
- **Mobile Application:** A native mobile application built with React Native or Expo.
- **CI/CD Pipeline Visualizer:** Visual representation of user code deployments and CI/CD pipelines.

## 3. Current Failures or Issues
The application has recently passed the build step (`npm run build`) successfully. However, minor technical debt or past issues that may still surface include:
- **Next.js 15+ Async Params:** Transitioning to Next.js 15+ required changing the App Router's `params` to a Promise format. While mostly fixed (`await params`), some older components might still need alignment.
- **Prisma Schema Mismatches:** Typing issues during the initial multi-tenant architecture setup were resolved, but database migrations must be carefully managed going forward.
- Currently, there are no major breaking failures, though minor strict-type warnings or ESLint errors (especially related to Framer Motion or Three.js) may appear during development.

## 4. Languages and Technologies Used
The project is a modern, enterprise-grade full-stack application built using:
- **TypeScript:** The primary language, ensuring strict typing and reducing runtime errors.
- **JavaScript:** Used in certain configurations and scripting files.
- **HTML/CSS:** Tailwind CSS (v4) for styling and JSX/TSX for UI structuring.
- **SQL:** At the database level (PostgreSQL interacting via Prisma).

## 5. Workflow Mechanism
The LWT workflow is designed to simulate a real-world corporate environment:
1. **Onboarding:** The user authenticates via Clerk and joins an AI-simulated company.
2. **Team Setup:** The user interacts with their AI co-workers (e.g., Tech Lead, PM) to understand the product.
3. **Task Assignment:** The AI PM assigns sprints and specific tasks to the user. 
4. **Execution:** The user completes the assigned tasks, whether writing code or creating designs.
5. **Review:** The AI Tech Lead provides constructive feedback and performs a thorough code review.
6. **Completion:** Upon successful review, the completed work is automatically added to the user's professional portfolio.
The entire system processes data in real-time leveraging Next.js Server Components, Prisma ORM, and the Groq/Gemini APIs.

## 6. Environment Variables (.env Files)
To run the project locally, the following variables must be configured in the `.env.local` or `.env` files:

**Clerk Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

**Database:**
- `DATABASE_URL` (PostgreSQL connection string)

**Cloudflare R2 / S3 Storage:**
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_PUBLIC`
- `R2_BUCKET_PRIVATE`
- `NEXT_PUBLIC_R2_PUBLIC_DOMAIN_ID`

**AI APIs:**
- `GROQ_API_KEY` (API key for LLM integrations)

## 7. Recent Updates
- **Auth Activation:** The early access waitlist has been completely removed. Full user Sign Up and Sign In flows via Clerk are now fully active across the application.
- **UI Consistency:** The global navigation and dashboard sidebars have been updated to enforce a consistent, hardcoded dark-mode aesthetic, preventing unintended color inversions when toggling between light and dark themes.
