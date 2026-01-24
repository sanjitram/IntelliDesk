import React, { useState } from "react";
import { Ticket } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Clock, ShieldAlert, RefreshCw, Search, X } from "lucide-react";

type SeverityFilter = 'All' | 'P1' | 'P2' | 'P3' | 'P4';

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
  onRefresh?: () => void;
}

export function TicketList({ tickets, selectedId, onSelect, onRefresh }: TicketListProps) {
  const [filter, setFilter] = useState<SeverityFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const p1Count = tickets.filter(t => t.severity === 'P1').length;
  const p2Count = tickets.filter(t => t.severity === 'P2').length;
  const p3Count = tickets.filter(t => t.severity === 'P3').length;
  const p4Count = tickets.filter(t => t.severity === 'P4').length;
  
  // Filter tickets based on severity filter and search query
  const filteredTickets = tickets.filter(t => {
    const matchesSeverity = filter === 'All' || t.severity === filter;
    const matchesSearch = searchQuery === '' || 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });
  
  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full w-full">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight font-[family-name:var(--font-jetbrains-mono)]">Inbox</h2>
          {onRefresh && (
            <button onClick={onRefresh} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" title="Refresh">
              <RefreshCw size={16} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-sm mt-2">
           <button 
             onClick={() => setFilter('All')}
             className={cn(
               "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border",
               filter === 'All' 
                 ? "bg-foreground/10 text-foreground border-foreground/20" 
                 : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
             )}
           >
             All ({tickets.length})
           </button>
           <button 
             onClick={() => setFilter('P1')}
             className={cn(
               "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border",
               filter === 'P1' 
                 ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" 
                 : "bg-transparent text-muted-foreground border-transparent hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
             )}
           >
             P1 ({p1Count})
           </button>
           <button 
             onClick={() => setFilter('P2')}
             className={cn(
               "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border",
               filter === 'P2' 
                 ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30" 
                 : "bg-transparent text-muted-foreground border-transparent hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400"
             )}
           >
             P2 ({p2Count})
           </button>
           <button 
             onClick={() => setFilter('P3')}
             className={cn(
               "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border",
               filter === 'P3' 
                 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" 
                 : "bg-transparent text-muted-foreground border-transparent hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
             )}
           >
             P3 ({p3Count})
           </button>
           <button 
             onClick={() => setFilter('P4')}
             className={cn(
               "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border",
               filter === 'P4' 
                 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" 
                 : "bg-transparent text-muted-foreground border-transparent hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
             )}
           >
             P4 ({p4Count})
           </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mt-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <ShieldAlert size={32} className="mb-2 opacity-50" />
          <p className="text-sm">No {filter} tickets found</p>
        </div>
      ) : (
        filteredTickets.map((ticket) => {
        const isSelected = selectedId === ticket.ticketId;
        const severityColor = {
          P1: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
          P2: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
          P3: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900",
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
              <span className="text-xs font-medium text-muted-foreground truncate max-w-[180px]" title={ticket.customer.email}>
                {ticket.customer.domain || ticket.customer.email.split('@')[1] || ticket.customer.email}
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
      })
      )}
    </div>
  );
}
