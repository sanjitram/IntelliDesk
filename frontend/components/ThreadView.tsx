import React from "react";
import { Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Mail, Reply, Share2 } from "lucide-react";

export function ThreadView({ ticket }: { ticket: Ticket }) {
  // Sort messages if needed, but assuming they are sorted for now
  const messages = ticket.messages;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors font-[family-name:var(--font-jetbrains-mono)]">
        Thread Timeline
      </h3>
      
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div key={msg.id} className={cn("flex gap-3", msg.merged ? "opacity-75" : "")}>
             <div className="flex flex-col items-center gap-1">
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === "support" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}>
                    {msg.role === "support" ? <Share2 size={14} /> : <Mail size={14} />}
                </div>
                {index !== messages.length - 1 && (
                    <div className="w-0.5 grow bg-slate-200 dark:bg-slate-800 my-1"></div>
                )}
             </div>

             <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm dark:shadow-none transition-colors">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        {msg.merged && <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800 mb-1 inline-block">Merged Duplicate</span>}
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{msg.sender}</h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{msg.timestamp}</div>
                    </div>
                </div>
                <h5 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{msg.subject}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
