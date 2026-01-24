import React, { useState } from "react";
import { Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { BrainCircuit, Sparkles, ChevronDown, ChevronUp, Merge } from "lucide-react";

export function AiReasoning({ ticket }: { ticket: Ticket }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-card/50 border border-border rounded-lg overflow-hidden mb-6 transition-colors shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/50 transition-colors text-foreground"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
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

          {/* Severity Analysis */}
          <div className="flex flex-col gap-1">
             <span className="text-xs font-medium text-muted-foreground uppercase">Severity Analysis</span>
             <div className="text-sm font-semibold text-foreground">{ticket.severity} Detected</div>
             <p className="text-xs text-muted-foreground leading-tight">
               {ticket.aiInsights.severityReason}
             </p>
          </div>

           {/* Deduplication */}
           <div className="flex flex-col gap-1">
             <span className="text-xs font-medium text-muted-foreground uppercase">Consolidation</span>
             <div className="flex items-center gap-2 text-sm text-foreground">
                <Merge className="w-4 h-4 text-muted-foreground" />
                <span>Merged {ticket.deduplication.mergedEmails} related emails</span>
             </div>
             <p className="text-xs text-muted-foreground">{Math.round(ticket.deduplication.similarity * 100)}% Content Similarity</p>
          </div>
        </div>
      )}
    </div>
  );
}
