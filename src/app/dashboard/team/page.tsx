"use client";

import { motion } from "framer-motion";
import { Users, Bot, Star, Activity, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    id: 1,
    name: "Gemini 1.5 Pro",
    role: "Senior Software Architect",
    isAi: true,
    status: "Online",
    tasksCompleted: 142,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Claude 3.5 Sonnet",
    role: "Lead UI/UX Designer",
    isAi: true,
    status: "Online",
    tasksCompleted: 89,
    rating: 4.8,
  },
  {
    id: 3,
    name: "You",
    role: "Junior Full Stack Engineer",
    isAi: false,
    status: "Online",
    tasksCompleted: 24,
    rating: 4.5,
  }
];

export default function TeamPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Team</h1>
          <p className="text-muted-foreground mt-1">Manage your AI workforce and human collaborators.</p>
        </div>
        <Button className="gap-2 border-0 bg-[image:var(--brand-gradient)] text-white shadow-md hover:opacity-90">
          <Users className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, i) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${member.isAi ? 'bg-accent' : 'bg-emerald-500'}`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${member.isAi ? 'bg-accent/20 text-accent-foreground dark:text-accent' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {member.isAi ? <Bot className="h-6 w-6" /> : <Users className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6 mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> Status</span>
                <span className="font-medium text-emerald-500">{member.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Bot className="h-4 w-4" /> Tasks Done</span>
                <span className="font-medium">{member.tasksCompleted}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" /> Rating</span>
                <span className="font-medium">{member.rating} / 5.0</span>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Mail className="h-4 w-4" /> Message
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
