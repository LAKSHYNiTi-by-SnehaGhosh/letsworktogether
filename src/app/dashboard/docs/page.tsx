"use client";

import { motion } from "framer-motion";
import { FileText, Folder, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const docs = [
  { id: 1, title: "LWT Master Architecture", type: "PRD", lastUpdated: "2 hours ago", icon: BookOpen },
  { id: 2, title: "Authentication Flow UI", type: "Design", lastUpdated: "Yesterday", icon: FileText },
  { id: 3, title: "Database Schema V1", type: "Technical", lastUpdated: "3 days ago", icon: Folder },
];

export default function DocsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">Access your PRDs, technical specs, and AI-generated documentation.</p>
        </div>
        <Button className="gap-2 bg-primary">
          <FileText className="h-4 w-4" /> New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc, i) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <doc.icon className="h-5 w-5 text-primary" />
            </div>
            
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-6 pt-4 border-t border-border/40">
              <span className="font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">{doc.type}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {doc.lastUpdated}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
