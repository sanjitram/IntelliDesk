"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8 h-full overflow-y-auto bg-background/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-2 font-[family-name:var(--font-jetbrains-mono)]">Performance Analytics</h1>
           <p className="text-muted-foreground">Real-time data across all support channels.</p>
        </div>

        {/* HUD Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
                { label: "Total Tickets", value: "1,248", change: "+12%", trend: "up", icon: BarChart3 },
                { label: "Avg Response", value: "1m 42s", change: "-8%", trend: "down", icon: Clock }, // Down is good for time
                { label: "CSAT Score", value: "4.8/5", change: "+2%", trend: "up", icon: Users },
                { label: "AI Resolution", value: "42%", change: "+15%", trend: "up", icon: TrendingUp },
             ].map((stat, i) => (
                 <div key={i} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                            <stat.icon size={20} />
                        </div>
                        <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' && stat.label !== 'Avg Response' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {stat.change}
                            {stat.trend === 'up' ? <ArrowUpRight size={14} className="ml-1"/> : <ArrowDownRight size={14} className="ml-1"/>}
                        </span>
                     </div>
                     <div className="text-3xl font-bold mb-1">{stat.value}</div>
                     <div className="text-sm text-muted-foreground">{stat.label}</div>
                 </div>
             ))}
        </div>

        {/* Charts Section (Mock Visuals) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm h-80 flex flex-col">
                <h3 className="font-semibold mb-6">Ticket Volume (30 Days)</h3>
                <div className="flex-1 flex items-end justify-between gap-2 px-2">
                    {[35, 42, 28, 55, 60, 48, 52, 38, 45, 65, 58, 49, 70, 62, 55].map((h, i) => (
                        <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                {h * 10}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             <div className="p-6 bg-card border border-border rounded-xl shadow-sm h-80 flex flex-col">
                <h3 className="font-semibold mb-6">Support Channels</h3>
                <div className="flex-1 flex items-center justify-center gap-12">
                    <div className="relative w-40 h-40 rounded-full border-8 border-primary/20 flex items-center justify-center">
                         <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-r-transparent rotate-45"></div>
                         <div className="text-center">
                             <div className="text-2xl font-bold">68%</div>
                             <div className="text-xs text-muted-foreground">Email</div>
                         </div>
                    </div>
                     <div className="flex flex-col gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span>Email (68%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                            <span>Chat (22%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                            <span>Phone (10%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
