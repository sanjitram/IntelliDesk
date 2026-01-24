import React, { useState } from "react";
import { Ticket } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

export function AiReasoning({ ticket }: { ticket: Ticket }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-card/50 border border-border rounded-lg overflow-hidden mb-6 transition-colors shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/50 transition-colors text-foreground"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold font-[family-name:var(--font-jetbrains-mono)]">IntelliDesk AI Reasoning</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Classification */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">Classification</span>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-foreground">{ticket.category}</div>
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium border border-primary/20">
                {Math.round(ticket.categoryConfidence * 100)}%
              </span>
            </div>
          </div>

          {/* Severity & Sentiment */}
          <div className="flex flex-col gap-1">
             <span className="text-xs font-medium text-muted-foreground uppercase">Severity Analysis</span>
             <div className="text-sm font-semibold text-foreground">{ticket.severity} Detected</div>
             <div className="text-xs text-muted-foreground leading-tight">
               {ticket.classification?.sentiment && (
               <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
                 Sentiment: {ticket.classification.sentiment}
               </p>
             )}
             </div>
          </div>

           {/* Flags / Status */}
           <div className="flex flex-col gap-1">
             <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">AI Flags</span>
             <div className="flex flex-wrap gap-2">
               {ticket.classification?.flags?.is_yelling && (
                 <span className="flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">
                   <AlertTriangle className="w-3 h-3" /> Yelling Detected
                 </span>
               )}
               {ticket.classification?.flags?.has_urgent_punctuation && (
                 <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                   Urgent Tone
                 </span>
               )}
               {ticket.is_escalated && (
                 <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
                   Escalated
                 </span>
               )}
               {!ticket.classification?.flags?.is_yelling && !ticket.classification?.flags?.has_urgent_punctuation && !ticket.is_escalated && (
                 <span className="text-xs text-slate-500 dark:text-slate-400">No special flags</span>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
