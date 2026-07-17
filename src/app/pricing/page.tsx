"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

export default function PricingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "half-yearly" | "yearly">("monthly");

  const developerProPrices = {
    monthly: 199,
    quarterly: 399,
    "half-yearly": 999,
    yearly: 1899
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <motion.header 
        initial="hidden"
        animate="show"
        variants={navVariants}
        className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#000211] text-white transition-all"
      >
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center ml-0 md:ml-2 py-2">
            <Image src="/full_icon.png" alt="LWT Workspace" width={400} height={280} className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-auto object-contain translate-y-[6px]" priority />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
              <Link href="/sign-in">
                <Button variant="ghost" className="inline-flex text-white hover:text-primary hover:bg-white/10 transition-colors text-sm px-4 py-2 h-9 rounded-full">Sign In</Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
              <Link href="/sign-up">
                <Button className="inline-flex border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg hover:shadow-primary/25 text-sm px-6 py-2 h-9 rounded-full transition-all">Get Started</Button>
              </Link>
            </motion.div>
            <button 
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="md:hidden border-t border-white/10 bg-[#000211]/90 backdrop-blur-3xl text-white px-4 py-6 space-y-6 overflow-hidden shadow-2xl"
            >
              <nav className="flex flex-col gap-6">
                <Link href="/#features" className="text-white/70 hover:text-white transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                <Link href="/pricing" className="text-white/70 hover:text-white transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              </nav>
              <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-white hover:text-primary hover:bg-white/10 transition-colors py-6 text-lg rounded-xl">Sign In</Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg py-6 text-lg rounded-xl">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1 pt-32 pb-20">
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">Start for free, upgrade when you need advanced AI capabilities and verified human mentors.</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full border border-border/50 bg-muted/30 p-1">
              {(["monthly", "quarterly", "half-yearly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-4 py-2 sm:px-6 rounded-full text-sm font-medium transition-colors ${
                    billingCycle === cycle 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="capitalize">{cycle.replace("-", " ")}</span>
                  {cycle === "yearly" && <span className="ml-2 text-xs text-primary font-bold">SAVE</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            {/* Student Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border/60 bg-card p-8 sm:p-10 shadow-sm relative overflow-hidden"
            >
              <h2 className="text-2xl font-semibold mb-2">Student</h2>
              <p className="text-muted-foreground mb-6">For students, beginners, and career switchers.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">Free</span>
                <span className="text-muted-foreground ml-2">Forever</span>
              </div>
              
              <Link href="/sign-up" className="block mb-10">
                <Button className="w-full py-6 rounded-xl" variant="outline">Start for Free</Button>
              </Link>
              
              <div className="space-y-4">
                <div className="font-medium mb-4">Included Features:</div>
                {[
                  "AI Workplace Access",
                  "One Workspace",
                  "Maximum Two Active Projects",
                  "Basic AI Project Manager",
                  "Basic AI Mentor",
                  "GitHub Integration",
                  "Sprint Planning & Task Management",
                  "Progress Dashboard",
                  "Basic Portfolio & XP System",
                  "Community Access"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
                
                <div className="font-medium mt-8 mb-4">Limitations:</div>
                {[
                  "Limited AI Requests & Analytics",
                  "No Human Mentor Requests"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground/70">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Developer Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-primary/50 bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50" />
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-2">Developer Pro</h2>
                <p className="text-muted-foreground mb-6">Unlimited AI capabilities and Human Mentor access.</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold">₹{developerProPrices[billingCycle]}</span>
                  <span className="text-muted-foreground ml-2">/ {billingCycle === "half-yearly" ? "6 months" : billingCycle.replace("ly", "")}</span>
                </div>
                
                <Link href="/sign-up" className="block mb-10">
                  <Button className="w-full py-6 rounded-xl border-0 bg-[image:var(--brand-gradient)] shadow-lg hover:shadow-primary/25">Upgrade to Pro</Button>
                </Link>
                
                <div className="space-y-4">
                  <div className="font-medium mb-4">Everything in Student, plus:</div>
                  {[
                    "Unlimited Projects & AI Usage",
                    "Advanced AI Mentor & Premium Project Gen",
                    "AI Architecture & Code Review",
                    "AI Documentation Generator",
                    "Advanced Workplace Simulation",
                    "AI Team Members",
                    "Advanced Analytics & Export Reports",
                    "Resume Builder & Portfolio Website",
                    "Career Readiness Report",
                    "Unlimited Team Collaboration",
                    "Access to Verified Human Mentors (Billed separately)"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/20 py-12 bg-muted/10 relative overflow-hidden mt-auto">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(99,102,241,0.03))] pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 items-center gap-y-4 relative z-10">
          <div className="flex justify-center lg:justify-start">
            <span className="text-sm font-medium text-muted-foreground">© 2026 LAKSHYNiTi.</span>
          </div>
          <div className="flex justify-center items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
            <Image src="/brand-icon.png" alt="LWT Icon" width={20} height={20} className="h-5 w-auto object-contain" />
            <span>LAKSHYNiTi LWT</span>
          </div>
          <div className="flex justify-center lg:justify-end gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
