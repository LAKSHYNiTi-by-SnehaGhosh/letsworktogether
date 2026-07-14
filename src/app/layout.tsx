import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { shadcn } from '@clerk/ui/themes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let's Work Together (LWT) | AI Professional Workspace",
  description: "The AI-powered execution layer between education and your first job. LWT brings tasks, projects, and AI mentors into one unified, stunning workspace.",
  keywords: ["AI Workspace", "Project Management", "SaaS", "Task Execution", "AI Mentor", "Developer Tools"],
  authors: [{ name: "LAKSHYNiTi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lwt.lakshyniti.com",
    title: "Let's Work Together (LWT)",
    description: "The AI-powered execution layer between education and your first job.",
    siteName: "Let's Work Together",
  },
  twitter: {
    card: "summary_large_image",
    title: "Let's Work Together (LWT)",
    description: "The AI-powered execution layer between education and your first job.",
  },
  icons: {
    icon: "/brand-icon.png",
    apple: "/brand-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
