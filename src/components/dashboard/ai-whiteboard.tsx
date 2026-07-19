"use client";

import React, { useState } from "react";
import { PenTool, Save, Trash2, Users, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

export function AiWhiteboard() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setPrompt(""); // Clear after generation
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <PenTool size={18} className="text-orange-500" />
          <h3 className="font-semibold">Sprint Planning Whiteboard</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1"><Users size={14} /> Collaborate</Button>
          <Button variant="outline" size="sm" className="h-8 gap-1"><Save size={14} /> Save</Button>
          <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setContent(null)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-zinc-950 p-6 relative overflow-y-auto flex flex-col items-center">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
        
        {content ? (
          <div className="w-full max-w-4xl z-10 prose dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground z-10">
            <p className="font-medium">Interactive Whiteboard</p>
            <p className="text-sm max-w-sm mb-4">Use AI to generate sprint plans, architecture notes, or project outlines.</p>
            
            {/* Placeholder Nodes */}
            <div className="relative w-full h-32 opacity-50 mb-8 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-40 p-2 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded shadow-sm text-left">
                <div className="text-[10px] font-semibold mb-1">Frontend</div>
                <div className="text-xs">Build 3D Office</div>
              </div>
              <div className="absolute bottom-0 right-1/4 w-40 p-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded shadow-sm text-left">
                <div className="text-[10px] font-semibold mb-1">Backend</div>
                <div className="text-xs">Setup WebSocket</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleGenerate} className="flex gap-2 w-full max-w-3xl mx-auto">
          <Input 
            placeholder="E.g., Generate a sprint plan for user authentication..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1 bg-background"
          />
          <Button type="submit" disabled={isGenerating || !prompt.trim()} className="gap-2">
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Generate
          </Button>
        </form>
      </div>
    </div>
  );
}
