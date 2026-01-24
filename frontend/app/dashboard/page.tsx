"use client";

import React, { useState } from "react";
import { mockTickets } from "@/data/mockData";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInbox } from "@/context/InboxContext";

export default function DashboardPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(mockTickets[0]?.ticketId || null);
  const { isInboxOpen } = useInbox();

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

      {/* Main Content (Ticket Detail) */}
      <div className="flex-1 h-full min-w-0 bg-background/50">
         <div className="h-full flex flex-col relative">
            <TicketDetail ticket={selectedTicket} />
         </div>
      </div>
    </div>
  );
}
