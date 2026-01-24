"use client";

import React, { useState, useEffect } from "react";
import { useTickets } from "@/hooks/useTickets";
import { Ticket } from "@/lib/api";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { LayoutDashboard, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInbox } from "@/context/InboxContext";

export default function DashboardPage() {
  const { tickets, loading, error, refetch } = useTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { isInboxOpen } = useInbox();

  // Auto-select first ticket when tickets load
  useEffect(() => {
    if (tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].ticketId);
    }
  }, [tickets, selectedTicketId]);

  const selectedTicket = tickets.find((t) => t.ticketId === selectedTicketId) || null;

  // Loading state
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Failed to load tickets</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (tickets.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No tickets yet</h2>
          <p className="text-muted-foreground">
            When customers submit support requests, they will appear here.
          </p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

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
            tickets={tickets}
            selectedId={selectedTicketId}
            onSelect={(ticket) => setSelectedTicketId(ticket.ticketId)}
            onRefresh={refetch}
        />
      </div>

      {/* Main Content (Ticket Detail) */}
      <div className="flex-1 h-full min-w-0 bg-background/50">
         <div className="h-full flex flex-col relative">
            <TicketDetail ticket={selectedTicket} onUpdate={refetch} />
         </div>
      </div>
    </div>
  );
}
