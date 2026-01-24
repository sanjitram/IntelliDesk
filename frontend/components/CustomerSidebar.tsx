import React from "react";
import { Ticket } from "@/data/mockData";
import { Building2, Globe, Crown, User, Users, Briefcase } from "lucide-react";

export function CustomerSidebar({ ticket }: { ticket: Ticket }) {
  const { customer } = ticket;

  return (
    <div className="md:w-[280px] shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 h-full flex flex-col gap-6 transition-colors">
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Customer Intelligence</h3>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-colors">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
              <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{customer.company}</div>
               <a href={`https://${customer.domain}`} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                 <Globe className="w-3 h-3" /> {customer.domain}
               </a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm pt-2 border-t border-slate-100">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600">Tier:</span>
            <span className="font-semibold text-slate-900">{customer.tier}</span>
          </div>
        </div>
      </div>

       <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Context</h3>
        <div className="flex flex-col gap-3">
             <div className="flex items-start gap-2 text-sm">
                <Users className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                    <div className="text-slate-500 text-xs">Assigned CSM</div>
                    <div className="font-medium text-slate-800">{customer.csm}</div>
                </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                    <div className="text-slate-500 text-xs">Contact Role</div>
                    <div className="font-medium text-slate-800">{customer.role}</div>
                </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                    <div className="text-slate-500 text-xs">Department</div>
                    <div className="font-medium text-slate-800">{customer.department}</div>
                </div>
            </div>
        </div>
      </div>

      {customer.isNewLead && (
         <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">New Opportunity Lead</span>
         </div>
      )}
    </div>
  );
}
