"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CheckCircle2, XCircle, ArrowRight, Zap, Users, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { WaitlistButton } from "@/components/WaitlistButton";

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
        className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md text-foreground transition-all"
      >
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center ml-0 md:ml-2 py-2">
            <Image src="/full_icon.png" alt="LWT Workspace" width={400} height={280} className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-auto object-contain translate-y-[6px]" priority />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#features" className="text-foreground/70 hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <ModeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
              <WaitlistButton className="inline-flex border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg hover:shadow-primary/25 text-sm px-6 py-2 h-9 rounded-full transition-all">Get Early Access</WaitlistButton>
            </motion.div>
            {/*
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
              <Link href="/sign-in">
                <Button variant="ghost" className="inline-flex text-foreground hover:text-primary hover:bg-muted transition-colors text-sm px-4 py-2 h-9 rounded-full">Sign In</Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
              <Link href="/sign-up">
                <Button className="inline-flex border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg hover:shadow-primary/25 text-sm px-6 py-2 h-9 rounded-full transition-all">Get Started</Button>
              </Link>
            </motion.div>
            */}
            <button 
              className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
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
              className="md:hidden border-t border-border bg-background px-4 py-6 space-y-6 overflow-hidden shadow-2xl"
            >
              <nav className="flex flex-col gap-6">
                <Link href="/#features" className="text-foreground/70 hover:text-foreground transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                <Link href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              </nav>
              <div className="flex flex-col gap-3 pt-6 border-t border-border">
                <WaitlistButton className="w-full border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg py-6 text-lg rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Get Early Access</WaitlistButton>
                {/*
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-foreground hover:text-primary hover:bg-muted transition-colors py-6 text-lg rounded-xl">Sign In</Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg py-6 text-lg rounded-xl">Get Started</Button>
                </Link>
                */}
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
                      ? "bg-background shadow-sm text-foreground border border-border/50" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="capitalize">{cycle.replace("-", " ")}</span>
                  {cycle === "yearly" && <span className="ml-2 text-xs text-primary font-bold">SAVE 20%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start mb-24">
            {/* Student Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border/60 bg-card p-8 sm:p-10 shadow-sm relative overflow-hidden h-full flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-semibold">🧑‍🎓 Student</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">Free</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for students starting their professional journey.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">Free</span>
                <span className="text-muted-foreground ml-2">Forever</span>
              </div>
              
              <WaitlistButton className="w-full py-6 rounded-xl mb-10" variant="outline">Join the Waiting List</WaitlistButton>
              {/*
              <Link href="/sign-up" className="block mb-10">
                <Button className="w-full py-6 rounded-xl" variant="outline">Start for Free</Button>
              </Link>
              */}
              
              <div className="space-y-4 flex-1">
                <div className="font-medium mb-4">Included Features:</div>
                {[
                  "AI Workplace Access",
                  "1 Workspace",
                  "Up to 2 Active Projects",
                  "Basic AI Project Manager",
                  "Basic AI Mentor",
                  "GitHub Integration",
                  "Sprint Planning",
                  "Task Management",
                  "Progress Dashboard",
                  "Basic Portfolio",
                  "XP & Reputation System",
                  "Community Access"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
                
                <div className="font-medium mt-8 mb-4">Limitations:</div>
                {[
                  "Limited AI requests per day",
                  "Limited project templates",
                  "Basic AI feedback",
                  "Basic analytics",
                  "Limited portfolio customization",
                  "No advanced AI project generation",
                  "No premium workplace simulation",
                  "No human mentor requests"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Developer Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-primary/50 bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden group h-full flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50" />
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-lg shadow-sm">RECOMMENDED</div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-semibold">💻 Developer Pro</span>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">For developers, freelancers, startup builders, and serious learners.</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold">₹{developerProPrices[billingCycle]}</span>
                  <span className="text-muted-foreground ml-2">/ {billingCycle === "half-yearly" ? "6 months" : billingCycle.replace("ly", "")}</span>
                </div>
                
                <WaitlistButton className="w-full py-6 rounded-xl border-0 bg-[image:var(--brand-gradient)] shadow-lg hover:shadow-primary/25 text-white mb-10">Join the Waiting List</WaitlistButton>
                {/*
                <Link href="/sign-up" className="block mb-10">
                  <Button className="w-full py-6 rounded-xl border-0 bg-[image:var(--brand-gradient)] shadow-lg hover:shadow-primary/25 text-white">Upgrade to Pro</Button>
                </Link>
                */}
                
                <div className="space-y-4 flex-1">
                  <div className="font-medium mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Everything in Student, plus:</div>
                  {[
                    "Unlimited Projects",
                    "Unlimited AI Usage (Fair Use Policy)",
                    "Advanced AI Mentor",
                    "Premium AI Project Generation",
                    "AI Architecture Review",
                    "AI Code Review",
                    "AI Documentation Generator",
                    "Advanced Workplace Simulation",
                    "AI Team Members",
                    "GitHub Integration",
                    "Advanced Analytics",
                    "Resume Builder",
                    "Portfolio Website",
                    "Career Readiness Reports",
                    "Export Reports",
                    "Priority AI Processing",
                    "Premium Templates",
                    "Team Collaboration",
                    "Early Access to New Features"
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

          <div className="max-w-4xl mx-auto mb-24">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold">Compare Features</h3>
              <p className="text-muted-foreground mt-2">See exactly what you get with each plan.</p>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-foreground w-[40%]">Feature</th>
                    <th className="px-6 py-4 font-semibold text-foreground text-center">Student</th>
                    <th className="px-6 py-4 font-semibold text-primary text-center">Developer Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { name: "GitHub Integration", student: "✅", pro: "✅" },
                    { name: "Basic AI Mentor", student: "✅", pro: "✅" },
                    { name: "Advanced AI Mentor", student: "❌", pro: "✅" },
                    { name: "Human Mentor Requests", student: "❌", pro: "✅" },
                    { name: "Unlimited Projects", student: "❌", pro: "✅" },
                    { name: "Advanced AI Project Generation", student: "❌", pro: "✅" },
                    { name: "Premium Workplace Simulation", student: "❌", pro: "✅" },
                    { name: "Portfolio Builder", student: "Basic", pro: "Advanced" },
                    { name: "AI Code Review", student: "Basic", pro: "Advanced" },
                    { name: "Team Collaboration", student: "Limited", pro: "Unlimited" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                      <td className="px-6 py-4 text-center">{row.student}</td>
                      <td className="px-6 py-4 text-center font-medium text-primary">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-24">
            {/* Human Mentor */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border/60 bg-gradient-to-br from-blue-500/10 via-background to-background p-8 sm:p-10 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">🧑‍🏫 Human Mentor Access</h3>
              <p className="text-muted-foreground mb-6">
                Developer Pro members can request a real human mentor for any project. Human mentorship is pay-per-project or pay-per-session and is billed separately from the Developer Pro subscription.
              </p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">When a request is submitted:</h4>
                <ul className="space-y-2">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                    LWT analyzes the project.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                    AI recommends the required expertise.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                    Verified mentors receive the request.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs">4</span>
                    The best matching mentor is assigned after approval.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-bold text-xs">5</span>
                    The student collaborates directly with the mentor throughout the project.
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Mentor Marketplace */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border/60 bg-gradient-to-br from-green-500/10 via-background to-background p-8 sm:p-10 shadow-sm"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">🧠 Mentor Marketplace</h3>
              <p className="text-muted-foreground mb-6">
                Mentors do not pay a subscription. Instead, they join the LWT Mentor Marketplace after a verification process.
              </p>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-foreground">Mentor Workflow:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Apply as a mentor & complete profile verification.</li>
                  <li>• Get approved by LWT.</li>
                  <li>• Receive project requests based on skills and availability.</li>
                  <li>• Accept or decline projects.</li>
                  <li>• Mentor students through sessions, code reviews, or guidance.</li>
                </ul>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-500" /> Revenue Model Example
                </h4>
                <p className="text-sm font-medium mb-2">Project Mentorship Fee: ₹2,000</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Student pays:</span>
                    <span className="font-medium text-foreground">₹2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee (20%):</span>
                    <span className="text-destructive">-₹400</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-1 mt-1 font-semibold text-foreground">
                    <span>Mentor payout (80%):</span>
                    <span className="text-green-500">₹1,600</span>
                  </div>
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
