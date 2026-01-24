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
      <div className="flex-1 flex items-center justify-center bg-background/50 text-muted-foreground transition-colors">
        <p>Select a ticket to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-background/30 transition-colors">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <div className="border-b border-border p-6 pb-4 bg-background/50 backdrop-blur-md transition-colors">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-foreground">#{ticket.ticketId}</span>
                <h1 className="text-xl font-semibold text-foreground/90 truncate">{ticket.subject}</h1>
            </div>
             <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-emerald-500' : 'bg-muted'}`}></span>
                    {ticket.status}
                </span>
                <span>•</span>
                <span>Created via Email</span>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-transparent">
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
