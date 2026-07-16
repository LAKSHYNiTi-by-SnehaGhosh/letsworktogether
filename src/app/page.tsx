"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { ArrowRight, Layers, Zap, Box, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

// Variants for staggering and scroll animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 } 
  },
};

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Smooth mouse tracking for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 15 });

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Smooth scroll parallax
  const { scrollYProgress, scrollY } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const boxY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const backgroundTemplate = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(99,102,241,0.08), transparent 40%)`;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background selection:bg-primary/30">
      {/* Interactive Spotlight (Desktop only) */}
      {isMounted && (
        <motion.div 
          className="pointer-events-none fixed inset-0 z-30 hidden md:block"
          style={{
            background: backgroundTemplate
          }}
        />
      )}

      <motion.header 
        initial="hidden"
        animate="show"
        variants={navVariants}
        className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#000211] text-white transition-all"
      >
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center ml-0 md:ml-2 py-2">
            <Image src="/full_icon.png" alt="LWT Workspace" width={400} height={280} className="w-[280px] md:w-[320px] h-auto object-contain translate-y-[6px]" priority />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="text-white/70 hover:text-white transition-colors">About</Link>
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

        {/* Mobile Menu */}
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
                <Link href="#features" className="text-white/70 hover:text-white transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                <Link href="#pricing" className="text-white/70 hover:text-white transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                <Link href="#about" className="text-white/70 hover:text-white transition-colors text-xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
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

      <main className="flex-1 pt-20">
        <section className="relative px-4 pt-16 pb-32 sm:px-6 lg:px-8 sm:pt-32 sm:pb-40 overflow-hidden min-h-[90vh] flex flex-col justify-center">
          {/* Animated Mesh Gradient Background */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background blur-3xl" 
          />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ y: heroY, opacity: heroOpacity }}
            className="container mx-auto max-w-5xl text-center relative z-10"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-foreground/90 max-w-4xl mx-auto">
                The AI-powered execution layer <br className="hidden sm:block" />
                <span className="bg-[image:var(--brand-gradient)] bg-clip-text text-transparent font-semibold">
                  between education and your first job
                </span>
              </h1>
            </motion.div>
            
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl font-medium leading-relaxed"
            >
              LWT brings your tasks, projects, AI mentors, and team collaboration into one unified, intelligent, and stunning workspace.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 25px rgba(99,102,241,0.4)", "0px 0px 0px rgba(99,102,241,0)"]
                }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                className="rounded-full w-full sm:w-auto"
              >
                <Link href="/sign-up" className="w-full block">
                  <Button size="lg" className="h-14 sm:h-14 w-full sm:w-auto px-8 text-base border-0 bg-[image:var(--brand-gradient)] text-white shadow-xl hover:shadow-primary/30 rounded-full transition-all">
                    Start Execution Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link href="#features" className="w-full block">
                  <Button size="lg" variant="outline" className="h-14 sm:h-14 w-full sm:w-auto px-8 text-base border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-colors bg-background/50 backdrop-blur-sm rounded-full">
                    Discover Features
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{ y: boxY }}
            transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.4 }}
            className="mx-auto mt-20 max-w-6xl sm:mt-28 perspective-[1200px]"
          >
            {/* Floating 3D Block */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2, z: 50 }}
              className="relative rounded-2xl border border-border/40 bg-card/40 p-2 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10 transition-transform duration-700 ease-out"
            >
              {/* Animated Glow behind the block */}
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-primary/10" 
              />
              
              <div className="rounded-xl border border-border/60 bg-background aspect-[16/8] md:aspect-[21/9] flex items-center justify-center relative overflow-hidden group">
                {/* Background Grid Pattern with parallax */}
                <motion.div 
                  className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] transition-transform duration-1000 group-hover:scale-105" 
                />
                
                <div className="text-center z-10 p-10 backdrop-blur-xl rounded-3xl border border-border/50 bg-background/70 shadow-2xl transition-all duration-500 group-hover:bg-background/80 group-hover:scale-105">
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ 
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Layers className="mx-auto h-16 w-16 text-primary mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold tracking-tight">Your 3D Workspace</h3>
                  <p className="text-muted-foreground mt-3 font-medium">Visualize your projects like never before.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="container mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-primary/5 blur-[120px] rounded-full -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Everything you need to execute faster</h2>
            <p className="mt-6 text-xl text-muted-foreground">Replace your fragmented toolchain with a single, deeply integrated operating system powered by AI.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Mentor",
                description: "Context-aware AI that understands your codebase, tasks, and goals to help you move faster.",
                icon: Zap,
              },
              {
                title: "Smart Projects",
                description: "Auto-organizing boards, timelines, and backlogs that adapt to your team's velocity.",
                icon: Layers,
              },
              {
                title: "3D Visualizations",
                description: "See your architecture and project dependencies in a stunning interactive 3D space.",
                icon: Box,
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 80, damping: 15, delay: i * 0.15 }}
                className="h-full"
              >
                <motion.div 
                  whileHover={{ 
                    y: -12, 
                    scale: 1.02,
                    boxShadow: "0 30px 60px -20px rgba(99,102,241,0.25)" 
                  }} 
                  className="rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 shadow-sm transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3 transition-all duration-300 relative z-10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors relative z-10">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg relative z-10">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border/20 py-12 bg-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(99,102,241,0.03))] pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">© 2026 LAKSHYNiTi.</span>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Image src="/brand-icon.png" alt="LWT Icon" width={20} height={20} className="h-4 w-4" />
              <span>&quot;Let&apos;s Work Together&quot; is a service provided by LAKSHYNiTi.</span>
            </div>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
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
