"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="rounded-3xl border border-border/60 bg-card/30 backdrop-blur-md p-10 sm:p-16 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50 transition-opacity duration-500" />
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8 flex items-center justify-center gap-4">
                <Image src="/brand-icon.png" alt="LWT Icon" width={40} height={40} className="w-10 h-10 object-contain" />
                About LWT
              </h1>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What is Let&apos;s Work Together?</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Let&apos;s Work Together (LWT) is an AI-powered Professional Execution Platform that bridges the gap between education and industry by enabling users to learn through real-world project execution. By combining AI guidance, collaborative teamwork, and industry-inspired workflows, LWT helps individuals build practical experience, strengthen professional skills, and create portfolios that reflect how modern products are developed.
              </p>
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
