import React, { useState } from "react";
import { Ticket } from "@/lib/api";
import { Building2, Globe, Crown, User, Users, Mail, ChevronLeft, ChevronRight, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomerSidebar({ ticket }: { ticket: Ticket }) {
  const { customer } = ticket;
  const [isOpen, setIsOpen] = useState(false);

  // Extract domain from email or use provided domain
  const domain = customer.domain || customer.email.split('@')[1] || '';

  const getTierInfo = (status: string) => {
    const t = status ? status.toLowerCase() : "standard";
    if (t.includes("auto") || t.includes("resolved")) {
        return { icon: Crown, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", label: "Auto-Resolved" };
    } else if (t.includes("progress") || t.includes("suggestion")) {
        return { icon: Zap, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", label: "In Progress" };
    } else {
        return { icon: Shield, color: "text-muted-foreground", bg: "bg-secondary", label: "New" };
    }
  };

  const tierInfo = getTierInfo(ticket.resolution.status);
  const TierIcon = tierInfo.icon;

  return (
    <div 
      className={cn(
        "shrink-0 border-l border-border bg-card/10 h-full flex flex-col transition-all duration-300 ease-in-out relative",
        isOpen ? "w-[280px] p-4 bg-background/50 backdrop-blur-md" : "w-14 items-center py-4 bg-background/20"
      )}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-3 top-6 bg-card border border-border rounded-full p-1 shadow-sm hover:scale-110 transition-transform z-10 text-muted-foreground hover:text-foreground"
      >
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {isOpen ? (
        // EXPANDED VIEW
        <div className="flex flex-col gap-6 fade-in animate-in duration-300">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3">Customer Info</h3>
            <div className="bg-card/50 p-3 rounded-lg border border-border shadow-sm flex flex-col gap-3 transition-colors">
              <div className="flex items-center gap-2">
                <div className="bg-secondary p-2 rounded-md">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground leading-tight break-all">{customer.email}</div>
                   {domain && (
                     <a href={`https://${domain}`} target="_blank" className="text-xs text-primary/80 hover:text-primary hover:underline flex items-center gap-1">
                       <Globe className="w-3 h-3" /> {domain}
                     </a>
                   )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm pt-2 border-t border-border">
                <TierIcon className={cn("w-4 h-4", tierInfo.color)} />
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-foreground">{ticket.status}</span>
              </div>
            </div>
          </div>

           <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3">Resolution</h3>
            <div className="flex flex-col gap-3">
                 <div className="flex items-start gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                        <div className="text-muted-foreground text-xs">Resolution Status</div>
                        <div className="font-medium text-foreground">{ticket.resolution.status.replace(/_/g, ' ')}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                        <div className="text-muted-foreground text-xs">Severity</div>
                        <div className="font-medium text-foreground">{ticket.severity}</div>
                    </div>
                </div>
                
                 <div className="flex items-start gap-2 text-sm">
                    <Zap className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                        <div className="text-muted-foreground text-xs">SLA</div>
                        <div className="font-medium text-foreground">{ticket.slaRemaining}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      ) : (
        // COLLAPSED VIEW
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300 cursor-pointer" onClick={() => setIsOpen(true)}>
             <div className="p-2 rounded-lg bg-secondary" title={customer.email}>
                <Mail className="w-5 h-5 text-muted-foreground" />
             </div>
             <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110", tierInfo.bg)} title={`Status: ${ticket.status}`}>
                <TierIcon className={cn("w-4 h-4", tierInfo.color)} />
             </div>
             <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-2" />
             <div title={`Severity: ${ticket.severity}`}>
                 <Shield className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" />
             </div>
        </div>
      )}
    </div>
  );
}
