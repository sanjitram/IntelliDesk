import React from "react";
import { Ticket } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Mail, Share2, Bot, User } from "lucide-react";

export function ThreadView({ ticket }: { ticket: Ticket }) {
  // Use thread from backend
  const messages = ticket.thread || [];

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors font-[family-name:var(--font-jetbrains-mono)]">
        Thread Timeline
      </h3>
      
      {messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No messages in this thread yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg, index) => {
            const isAI = msg.sender === 'AI_Agent';
            const isCustomer = msg.role === 'customer';
            
            return (
              <div key={msg.id} className="flex gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isAI ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" :
                      isCustomer ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400" :
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  )}>
                      {isAI ? <Bot size={14} /> : isCustomer ? <User size={14} /> : <Share2 size={14} />}
                  </div>
                  {index !== messages.length - 1 && (
                      <div className="w-0.5 grow bg-slate-200 dark:bg-slate-800 my-1"></div>
                  )}
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm dark:shadow-none transition-colors">
                  <div className="flex justify-between items-start mb-2">
                      <div>
                          {isAI && <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 mb-1 inline-block">AI Generated</span>}
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{msg.sender}</h4>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{msg.timestamp}</div>
                      </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
