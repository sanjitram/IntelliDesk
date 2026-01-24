"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { mockTickets, Ticket } from "@/data/mockData";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { LayoutDashboard, Settings, Search, Bell, Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(mockTickets[0]?.ticketId || null);
  const [isInboxOpen, setIsInboxOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const selectedTicket = mockTickets.find((t) => t.ticketId === selectedTicketId) || null;

  return (
    <div className="flex h-screen w-full bg-background font-sans text-foreground overflow-hidden">
        {/* Navigation Rail - Mocked for visual completeness */}
        <div className="w-16 bg-card border-r border-border flex flex-col items-center py-6 gap-6 shrink-0 z-10 transition-colors">
            <Link href="/home" className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground mb-4 shadow-lg shadow-primary/20 hover:scale-105 transition-transform" title="Go to Home">
                ID
            </Link>
            <button 
                onClick={() => setIsInboxOpen(!isInboxOpen)}
                className={`p-2 rounded-lg transition-colors ${isInboxOpen ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
                title={isInboxOpen ? "Collapse Inbox" : "Expand Inbox"}
            >
                <LayoutDashboard size={20} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
                 <Search size={20} />
            </button>
             <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
                 <Bell size={20} />
            </button>
            <div className="mt-auto flex flex-col gap-6">
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors">
                    <Settings size={20} />
                </button>
            </div>
        </div>

      {/* App Shell */}
      <div className="flex flex-1 overflow-hidden">
        {isInboxOpen && (
            <TicketList
            tickets={mockTickets}
            selectedId={selectedTicketId}
            onSelect={(ticket) => setSelectedTicketId(ticket.ticketId)}
            />
        )}
        <TicketDetail ticket={selectedTicket} />
      </div>
    </div>
  );
}
