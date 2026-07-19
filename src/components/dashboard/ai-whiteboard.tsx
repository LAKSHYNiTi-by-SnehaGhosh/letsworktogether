"use client";

import React from "react";
import { PenTool, Save, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiWhiteboard() {
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
          <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={14} /></Button>
        </div>
      </div>
      <div className="flex-1 bg-white dark:bg-zinc-950 p-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        </div>
        
        {/* Placeholder Nodes */}
        <div className="absolute top-1/4 left-1/4 w-48 p-3 bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm">
          <div className="text-xs font-semibold mb-1">Frontend</div>
          <div className="text-sm">Build 3D Office</div>
        </div>

        <div className="absolute top-1/3 right-1/4 w-48 p-3 bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 rounded-lg shadow-sm">
          <div className="text-xs font-semibold mb-1">Backend</div>
          <div className="text-sm">Setup WebSocket server</div>
        </div>

        <div className="text-center text-muted-foreground z-10">
          <p className="font-medium">Interactive Whiteboard</p>
          <p className="text-sm">Drag & drop sticky notes or draw with AI.</p>
        </div>
      </div>
    </div>
  );
}
