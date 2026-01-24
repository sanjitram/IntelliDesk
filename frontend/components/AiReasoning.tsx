import React, { useState } from "react";
import { Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { BrainCircuit, Sparkles, ChevronDown, ChevronUp, Merge } from "lucide-react";

export function AiReasoning({ ticket }: { ticket: Ticket }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-lg overflow-hidden mb-6 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-indigo-100/50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition-colors text-indigo-900 dark:text-indigo-100"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold">IntelliDesk AI Reasoning</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Classification */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Classification</span>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ticket.category}</div>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                {Math.round(ticket.categoryConfidence * 100)}%
              </span>
            </div>
          </div>

          {/* Severity Analysis */}
          <div className="flex flex-col gap-1">
             <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Severity Analysis</span>
             <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ticket.severity} Detected</div>
             <p className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
               {ticket.aiInsights.severityReason}
             </p>
          </div>

           {/* Deduplication */}
           <div className="flex flex-col gap-1">
             <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Consolidation</span>
             <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                <Merge className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Merged {ticket.deduplication.mergedEmails} related emails</span>
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400">{Math.round(ticket.deduplication.similarity * 100)}% Content Similarity</p>
          </div>
        </div>
      )}
    </div>
  );
}
