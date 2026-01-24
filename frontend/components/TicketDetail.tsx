import React from "react";
import { Ticket } from "@/data/mockData";
import { AiReasoning } from "./AiReasoning";
import { ThreadView } from "./ThreadView";
import { CustomerSidebar } from "./CustomerSidebar";
import { ResponsePreview } from "./ResponsePreview";

interface TicketDetailProps {
  ticket: Ticket | null;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 transition-colors">
        <p>Select a ticket to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 p-6 pb-4 bg-white dark:bg-slate-900 transition-colors">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">#{ticket.ticketId}</span>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200 truncate">{ticket.subject}</h1>
            </div>
             <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
                    {ticket.status}
                </span>
                <span>•</span>
                <span>Created via Email</span>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50/50 dark:bg-slate-950">
          <AiReasoning ticket={ticket} />
          <ThreadView ticket={ticket} />
        </div>

        {/* Response Area (Fixed at bottom of main panel) */}
        <ResponsePreview ticket={ticket} />
      </div>

       {/* Right Sidebar */}
       <CustomerSidebar ticket={ticket} />
    </div>
  );
}
