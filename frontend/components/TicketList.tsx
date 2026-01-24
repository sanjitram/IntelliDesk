import React from "react";
import { Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Clock, ShieldAlert } from "lucide-react";

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight">Inbox</h2>
        <div className="flex gap-2 text-sm mt-2">
           <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-semibold">All ({tickets.length})</span>
           <span className="bg-background border border-border text-muted-foreground px-2 py-1 rounded-full text-xs">P1 (1)</span>
        </div>
      </div>
      
      {tickets.map((ticket) => {
        const isSelected = selectedId === ticket.ticketId;
        const severityColor = {
          P1: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
          P2: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
          P3: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
          P4: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
        }[ticket.severity];

        return (
          <div
            key={ticket.ticketId}
            onClick={() => onSelect(ticket)}
            className={cn(
              "group relative flex flex-col gap-3 p-4 rounded-xl border transition-all cursor-pointer",
              isSelected
                ? "bg-card border-primary/50 shadow-md ring-1 ring-primary/50"
                : "bg-card/50 border-border hover:bg-card hover:border-border/80"
            )}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-muted-foreground">
                {ticket.customer.company}
              </span>
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded border",
                  severityColor
                )}
              >
                {ticket.severity}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 leading-tight line-clamp-2">
              {ticket.subject}
            </h3>

            <div className="flex items-center gap-2 mt-auto">
              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[120px]">
                {ticket.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                {ticket.severity === "P1" && <ShieldAlert size={12} className="text-red-500 dark:text-red-400" />}
                <Clock size={12} />
                <span>{ticket.slaRemaining}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 rounded">AI Confidence: {Math.round(ticket.categoryConfidence * 100)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
