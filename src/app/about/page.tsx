"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, BrainCircuit, Users, Target, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } }
};

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <Button className="inline-flex border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg hover:shadow-primary/25 text-sm px-6 py-2 h-9 rounded-full transition-all">Get Early Access</Button>
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
                <Button className="w-full border-0 bg-[image:var(--brand-gradient)] text-white shadow-lg py-6 text-lg rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Get Early Access</Button>
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
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="rounded-[2.5rem] border border-border/60 bg-card p-10 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-8">
                <Image src="/brand-icon.png" alt="LWT Icon" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-8">
                Bridging the Gap Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Education & Industry</span>
              </h1>
              <p className="mt-4 text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
                Let&apos;s Work Together (LWT) is an AI-powered Professional Execution Platform that enables you to learn through real-world project execution.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How LWT Transforms Your Career</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We replace traditional tutorials with industry-inspired workflows, AI guidance, and real human mentorship.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Briefcase className="w-8 h-8 text-blue-500" />,
                title: "Practical Experience",
                desc: "Stop watching tutorials. Start building products. LWT simulates a real work environment where you manage sprints, write documentation, and review code.",
                color: "bg-blue-500/10"
              },
              {
                icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
                title: "AI-Powered Guidance",
                desc: "Stuck on a bug? Need an architecture review? Your AI Mentor and AI Team Members are available 24/7 to guide you through complex technical decisions.",
                color: "bg-purple-500/10"
              },
              {
                icon: <Users className="w-8 h-8 text-green-500" />,
                title: "Real Human Mentorship",
                desc: "Connect with verified industry professionals through our Mentor Marketplace. Get 1-on-1 guidance, architecture reviews, and career advice.",
                color: "bg-green-500/10"
              },
              {
                icon: <Target className="w-8 h-8 text-red-500" />,
                title: "Industry-Standard Workflows",
                desc: "Experience how real companies operate. Integrate with GitHub, plan sprints, manage kanban boards, and execute tasks professionally.",
                color: "bg-red-500/10"
              },
              {
                icon: <Rocket className="w-8 h-8 text-orange-500" />,
                title: "Stunning Portfolios",
                desc: "Every completed project automatically builds out a stunning, verifiable professional portfolio that you can proudly share with recruiters.",
                color: "bg-orange-500/10"
              },
              {
                icon: <GraduationCap className="w-8 h-8 text-teal-500" />,
                title: "Career Readiness",
                desc: "Earn XP, build a reputation, and generate Career Readiness Reports that prove you have what it takes to succeed in the modern tech industry.",
                color: "bg-teal-500/10"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-card border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-colors group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] bg-[image:var(--brand-gradient)] p-10 sm:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">Ready to Build Your Future?</h2>
              <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of students and developers who are accelerating their careers through real-world project execution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8 h-14 text-lg">
                  Join the Waiting List
                </Button>
                {/*
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8 h-14 text-lg">
                    Get Started for Free
                  </Button>
                </Link>
                */}
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white text-black hover:bg-white/10 font-bold px-8 h-14 text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
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
