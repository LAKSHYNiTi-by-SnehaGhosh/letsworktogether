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
    <ClerkProvider 
      appearance={{ 
        theme: shadcn,
        layout: {
          logoImageUrl: '/brand-icon.png',
        },
        elements: {
          watermark: "hidden",
        }
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col relative">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* Custom Branding Footer for Development */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-sm text-xs text-muted-foreground">
              <img src="/brand-icon.png" alt="LWT Logo" className="w-4 h-4 rounded-sm" />
              <span className="font-medium text-foreground">Let&apos;s Work Together</span>
              <span className="mx-1">•</span>
              <span>Development by LAKSHYNiTi</span>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
