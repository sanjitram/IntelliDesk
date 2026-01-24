"use client";

import React, { useState } from "react";
import { mockTickets } from "@/data/mockData";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(mockTickets[0]?.ticketId || null);
  const [isInboxOpen, setIsInboxOpen] = useState(true);

  const selectedTicket = mockTickets.find((t) => t.ticketId === selectedTicketId) || null;

  return (
    <div className="flex h-full w-full relative">
      {/* Collapsible Inbox List */}
      <div 
        className={cn(
            "transition-all duration-300 ease-in-out border-r border-border h-full flex flex-col relative bg-card/50 backdrop-blur-sm",
            isInboxOpen ? "w-[400px] translate-x-0" : "w-0 -translate-x-full overflow-hidden opacity-0"
        )}
      >
        <TicketList
            tickets={mockTickets}
            selectedId={selectedTicketId}
            onSelect={(ticket) => setSelectedTicketId(ticket.ticketId)}
        />
      </div>

      {/* Floating Toggle Button (Visible when closed) */}
      {!isInboxOpen && (
        <button
            onClick={() => setIsInboxOpen(true)}
            className="absolute top-4 left-4 z-20 p-2 bg-card border border-border shadow-md rounded-lg hover:bg-accent transition-colors"
        >
            <LayoutDashboard size={20} className="text-foreground" />
        </button>
      )}

      {/* Main Content (Ticket Detail) */}
      <div className="flex-1 h-full min-w-0 bg-background/50">
         <div className="h-full flex flex-col relative">
             {/* Header Toggle (Visible when open) */}
             {isInboxOpen && (
                <div className="absolute top-3 left-3 z-20">
                    <button
                        onClick={() => setIsInboxOpen(false)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                        title="Collapse Inbox"
                    >
                        <LayoutDashboard size={18} />
                    </button>
                </div>
             )}
             
            <TicketDetail ticket={selectedTicket} />
         </div>
      </div>
    </div>
  );
}
