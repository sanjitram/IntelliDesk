import React, { useState } from "react";
import { Ticket } from "@/data/mockData";
import { Building2, Globe, Crown, User, Users, Briefcase, ChevronLeft, ChevronRight, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomerSidebar({ ticket }: { ticket: Ticket }) {
  const { customer } = ticket;
  const [isOpen, setIsOpen] = useState(false);

  const getTierInfo = (tier: string) => {
    const t = tier ? tier.toLowerCase() : "standard";
    if (t.includes("enterprise") || t.includes("platinum")) {
        return { icon: Crown, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", label: "Enterprise" };
    } else if (t.includes("growth") || t.includes("gold")) {
        return { icon: Zap, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", label: "Growth" };
    } else {
        return { icon: Shield, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", label: "Standard" };
    }
  };

  const tierInfo = getTierInfo(customer.tier);
  const TierIcon = tierInfo.icon;

  return (
    <div 
      className={cn(
        "shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 h-full flex flex-col transition-all duration-300 ease-in-out relative",
        isOpen ? "w-[280px] p-4" : "w-14 items-center py-4 bg-white dark:bg-slate-950"
      )}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm hover:scale-110 transition-transform z-10"
      >
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {isOpen ? (
        // EXPANDED VIEW
        <div className="flex flex-col gap-6 fade-in animate-in duration-300">
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Customer Intelligence</h3>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-colors">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                  <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{customer.company}</div>
                   <a href={`https://{customer.domain}`} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                     <Globe className="w-3 h-3" /> {customer.domain}
                   </a>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <TierIcon className={cn("w-4 h-4", tierInfo.color)} />
                <span className="text-slate-600 dark:text-slate-400">Tier:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{customer.tier}</span>
              </div>
            </div>
          </div>

           <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Context</h3>
            <div className="flex flex-col gap-3">
                 <div className="flex items-start gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs">Assigned CSM</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{customer.csm}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs">Contact Role</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{customer.role}</div>
                    </div>
                </div>
                
                 <div className="flex items-start gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs">Latest Deal</div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">12,500 <span className="text-green-600 text-xs">(Open)</span></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      ) : (
        // COLLAPSED VIEW
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300 cursor-pointer" onClick={() => setIsOpen(true)}>
             <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800" title={customer.company}>
                <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
             </div>
             <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110", tierInfo.bg)} title={`Tier: {customer.tier}`}>
                <TierIcon className={cn("w-4 h-4", tierInfo.color)} />
             </div>
             <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-2" />
             <div title={`CSM: {customer.csm}`}>
                 <Users className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" />
             </div>
        </div>
      )}
    </div>
  );
}
