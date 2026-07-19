# Project Report: Let's Work Together (LWT)

এই রিপোর্টটিতে LWT (Let's Work Together) প্রজেক্টের বর্তমান অবস্থা, ফিচার্স, ল্যাঙ্গুয়েজ এবং অন্যান্য গুরুত্বপূর্ণ বিষয়ের বিস্তারিত বিবরণ দেওয়া হলো।

## 1. Ki Ki Features Ache (বর্তমান ফিচারসমূহ)
বর্তমানে প্রজেক্টটিতে নিচের মূল ফিচারগুলো রয়েছে:
- **AI Workforce:** প্রজেক্টটিতে Role-specific AI পার্সোনালিটি (যেমন AI CEO, PM, Tech Lead) রয়েছে যারা কোড এবং ডিজাইন ইভ্যালুয়েট করে।
- **Enterprise Emulation:** ইউজাররা বিভিন্ন simulated অর্গানাইজেশনে (SaaS, FinTech, Healthcare) জয়েন করতে পারে।
- **Sprint & Task Execution:** প্রফেশনাল ওয়ার্কফ্লো, স্ট্যান্ডআপ এবং পারফরম্যান্স ট্র্যাকিং সিস্টেম।
- **Portfolio Generation:** রিয়েল এক্সিকিউশন মেট্রিক্সের উপর ভিত্তি করে অটোমেটেড পোর্টফোলিও তৈরি করা।
- **Authentication & Security:** Clerk Auth এর মাধ্যমে সিকিউরড লগইন/রেজিস্ট্রেশন এবং Enterprise Role-Based Access Control (RBAC)।
- **Multi-Tenancy:** Organization এবং Team ম্যানেজমেন্ট।
- **3D Visuals:** Three.js এবং React Three Fiber দিয়ে ডাইনামিক 3D এনভায়রনমেন্ট।
- **Database & Storage:** PostgreSQL (Neon) ডেটাবেস এবং Cloudflare R2 / AWS S3 স্টোরেজ ইন্টিগ্রেশন।

## 2. Ki Ki Features Deoya Jete Pare (ভবিষ্যতে যা যোগ করা যেতে পারে)
ভবিষ্যতে প্ল্যাটফর্মটিকে আরও উন্নত করতে নিচের ফিচারগুলো অ্যাড করা যেতে পারে:
- **Real-time Collaboration:** WebSockets ব্যবহার করে রিয়েল-টাইম চ্যাট এবং কোলাবোরেশন।
- **GitHub / GitLab Integration:** সরাসরি রিপোজিটরি থেকে কোড ফেচ করে AI Code Review করা।
- **Advanced Analytics Dashboard:** ইউজারদের পারফরম্যান্স এবং স্প্রিন্ট প্রগ্রেস দেখার জন্য ডিটেইলড ড্যাশবোর্ড।
- **Payment Gateway / Billing:** Stripe বা অন্য কোনো পেমেন্ট গেটওয়ে ইন্টিগ্রেট করে সাবস্ক্রিপশন মডেল (Pro/Enterprise) চালু করা।
- **Mobile Application:** React Native বা Expo দিয়ে নেটিভ মোবাইল অ্যাপ তৈরি করা।
- **CI/CD Pipeline Visualizer:** ইউজাররা কীভাবে কোড ডেপ্লয় করছে তার ভিজ্যুয়াল রিপ্রেজেন্টেশন।

## 3. Ki Ki Failures (বর্তমান ত্রুটি বা ফেইলিওর)
সম্প্রতি অ্যাপটি সফলভাবে পাস করেছে। তবে কিছু সাধারণ ইস্যু যা আগে ফেস করা হয়েছিল এবং বর্তমান অবস্থায় থাকতে পারে:
- **Next.js 15+ Async Params:** Next.js 15+ এ অ্যাপ রাউটারের `params` Promise-এ পরিবর্তিত হওয়ার কারণে কিছু টাইপস্ক্রিপ্ট এরর ছিল, যা ফিক্স করা হয়েছে (যেমন `await params` ব্যবহার করে)।
- **Prisma Schema Mismatches:** মাল্টি-টিন্যান্ট আর্কিটেকচার সেটআপের সময় কিছু টাইপিং ইস্যু ছিল যা আপডেট করা হয়েছে।
- বর্তমানে মেজর কোনো ফেইলিওর নেই, তবে 3D কম্পোনেন্ট বা থার্ড-পার্টি লাইব্রেরি (Framer Motion) এর কিছু minor strict-type ওয়ার্নিং বা ESLint এরর থাকতে পারে।

## 4. Which Languages are Used (ব্যবহৃত ভাষাসমূহ)
এই প্রজেক্টটি একটি মডার্ন ফুল-স্ট্যাক অ্যাপ। এখানে ব্যবহৃত প্রধান ল্যাঙ্গুয়েজ এবং টেকনোলজিগুলো হলো:
- **TypeScript:** মূল ল্যাঙ্গুয়েজ হিসেবে ব্যবহৃত হয়েছে (স্ট্রং টাইপিং এর জন্য)।
- **JavaScript:** কিছু কনফিগারেশন এবং স্ক্রিপ্টিং-এ।
- **HTML / CSS:** Tailwind CSS (v4) এর মাধ্যমে স্টাইলিং এবং JSX/TSX ফাইলে স্ট্রাকচারিং।
- **SQL:** ডাটাবেস লেভেলে (PostgreSQL/Prisma)।

## 5. How Does Workflow Works (ওয়ার্কফ্লো যেভাবে কাজ করে)
LWT এর ওয়ার্কফ্লো মূলত একটি রিয়েল-ওয়ার্ল্ড কর্পোরেট পরিবেশকে সিমুলেট করে:
1. **Onboarding:** ইউজার Clerk এর মাধ্যমে অথেন্টিকেট করে এবং একটি AI-simulated কোম্পানিতে জয়েন করে।
2. **Team Setup:** ইউজার তার AI কো-ওয়ার্কারদের (Tech Lead, PM) সাথে ইন্টারঅ্যাক্ট করে।
3. **Task Assignment:** AI PM ইউজারকে স্প্রিন্ট এবং টাস্ক অ্যাসাইন করে। 
4. **Execution:** ইউজার টাস্ক কমপ্লিট করে (কোড লেখা বা ডিজাইন তৈরি করা)।
5. **Review:** AI টেক লিড ইউজারের কাজের উপর ফিডব্যাক দেয় এবং কোড রিভিউ করে।
6. **Completion:** কাজ শেষ হলে তা পোর্টফোলিওতে অটোমেটিকভাবে অ্যাড হয়ে যায়।
পুরো সিস্টেমটি Next.js Server Components, Prisma ORM এবং Gemini/OpenAI API (Groq) এর সাহায্যে রিয়েল-টাইমে ডেটা প্রসেস করে।

## 6. .env Files Environmental Variables (এনভায়রনমেন্ট ভেরিয়েবলসমূহ)
প্রজেক্টটি সঠিকভাবে রান করার জন্য `.env.local` এবং `.env` ফাইলে নিচের ভেরিয়েবলগুলো কনফিগার করা আছে:

**Clerk Authentication (অথেন্টিকেশন):**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

**Database (ডাটাবেস):**
- `DATABASE_URL` (PostgreSQL কানেকশন স্ট্রিং)

**Cloudflare R2 / S3 Storage (স্টোরেজ):**
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_PUBLIC`
- `R2_BUCKET_PRIVATE`
- `NEXT_PUBLIC_R2_PUBLIC_DOMAIN_ID`

**AI APIs (এআই এপিআই):**
- `GROQ_API_KEY` (Groq API এর জন্য)
