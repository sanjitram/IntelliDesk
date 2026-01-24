"use client";

import React, { useState, useEffect } from "react";
import { Building2, Mail, Phone, MoreHorizontal, Filter, Plus } from "lucide-react";
import { getTickets, Ticket } from "@/lib/api";

type CustomerGroup = {
  name: string;
  domain: string;
  tier: string;
  users: number; // Unique emails
  ticketCount: number;
  status: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
      const fetchData = async () => {
          try {
              const tickets = await getTickets();
              const domainMap = new Map<string, { emails: Set<string>; ticketCount: number; latestDate: Date }>();

              tickets.forEach(t => {
                  let domain = t.customer.domain;
                  if (!domain && t.customer.email.includes('@')) {
                      domain = t.customer.email.split('@')[1];
                  }
                  if (!domain) domain = 'Unknown';

                  if (!domainMap.has(domain)) {
                      domainMap.set(domain, { emails: new Set(), ticketCount: 0, latestDate: new Date(0) });
                  }
                  const entry = domainMap.get(domain)!;
                  entry.emails.add(t.customer.email);
                  entry.ticketCount++;
                  
                  const tDate = new Date(t.createdAt);
                  if (tDate > entry.latestDate) entry.latestDate = tDate;
              });

              const processedCustomers: CustomerGroup[] = Array.from(domainMap.entries()).map(([domain, data]) => {
                  const userCount = data.emails.size;
                  
                  // Determine Tier dynamically
                  let tier = "Standard";
                  if (userCount > 10 || data.ticketCount > 20) tier = "Enterprise";
                  else if (userCount > 3 || data.ticketCount > 5) tier = "Growth";

                  // Determine Status based on recency
                  const daysSinceLastActive = (new Date().getTime() - data.latestDate.getTime()) / (1000 * 3600 * 24);
                  let status = "Active";
                  if (daysSinceLastActive > 30) status = "Inactive";
                  else if (daysSinceLastActive > 14) status = "Churn Risk";

                  // Pretty name
                  const name = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

                  return {
                      name: name,
                      domain: domain,
                      tier: tier,
                      users: userCount,
                      ticketCount: data.ticketCount,
                      status: status
                  };
              });

              setCustomers(processedCustomers);
          } catch (error) {
              console.error("Failed to load customers", error);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto bg-background/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
         <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2 font-[family-name:var(--font-jetbrains-mono)]">Customer Base</h1>
                <p className="text-muted-foreground">Manage accounts, tiers, and health scores.</p>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Plus size={18} />
                Add Customer
            </button>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-4">
                 <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/50 border-none rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary/50 text-sm" 
                    />
                 </div>
                 <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground"><Filter size={18} /></button>
            </div>
            
            {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
            ) : (
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Tier</th>
                        <th className="px-6 py-4">Users / Tickets</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    {customers
                        .filter(c => 
                            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.domain.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .length > 0 ? (
                        customers
                            .filter(c => 
                                c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                c.domain.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((c, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors group">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Building2 size={18} />
                                     </div>
                                     <div>
                                         <div className="font-semibold">{c.name}</div>
                                         <div className="text-xs text-muted-foreground">{c.domain}</div>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                     c.tier === 'Enterprise' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900' :
                                     c.tier === 'Growth' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900' :
                                     'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                 }`}>
                                     {c.tier}
                                 </span>
                             </td>
                             <td className="px-6 py-4 text-muted-foreground">
                                <span className="font-medium text-foreground">{c.users} Users</span>
                                <span className="text-xs ml-2">({c.ticketCount} Tickets)</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${c.status === 'Active' ? 'bg-green-500' : c.status === 'Churn Risk' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                    <span>{c.status}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                     <MoreHorizontal size={18} />
                                 </button>
                             </td>
                        </tr>
                    ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No customers found in records.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            )}
        </div>
      </div>
    </div>
  );
}
