"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  Sun, 
  Moon, 
  MessageSquare
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const navItems = [
    { href: "/dashboard", icon: MessageSquare, label: "Inbox" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-16 h-full bg-card border-r border-border flex flex-col items-center py-6 gap-6 shrink-0 z-20 transition-colors">
      <Link 
        href="/" 
        className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground mb-4 shadow-lg shadow-primary/20 hover:scale-105 transition-transform" 
        title="Go to Landing Page"
      >
        ID
      </Link>

      <div className="flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "p-2 rounded-xl flex justify-center transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip on hover */}
              <span className="absolute left-14 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto mb-16 flex flex-col gap-6">
        <button 
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors relative group"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             <span className="absolute left-14 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                Switch Theme
              </span>
        </button>
      </div>
    </div>
  );
}
