"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  BarChart3, 
  Bot, 
  Moon, 
  Sun,
  LayoutDashboard
} from "lucide-react";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
              ID
            </div>
            <span className="font-bold text-xl tracking-tight">IntelliDesk AI</span>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              href="/"
              className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors items-center gap-2"
            >
              <LayoutDashboard size={16} />
              Launch Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 border-b border-border bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Customer Support, <br />
              <span className="text-primary">supercharged by AI.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              IntelliDesk analyzes tickets, drafts responses, and provides real-time context—so your team can focus on solving problems, not reading logs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-lg flex items-center justify-center font-medium text-lg transition-all shadow-lg hover:shadow-primary/25"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Mock UI Preview */}
            <div className="mt-16 w-full max-w-5xl rounded-xl border border-border shadow-2xl bg-card overflow-hidden">
                <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className="p-1 md:p-2 bg-muted/10 h-[300px] md:h-[400px] flex items-center justify-center text-muted-foreground/50">
                    {/* Abstract representation of the dashboard */}
                    <div className="flex flex-col items-center gap-4">
                        <Bot size={48} className="opacity-50" />
                        <p>Dashboard Preview</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section */}
        <section className="py-24 bg-background relative overflow-hidden">
          {/* Subtle background gradient to match the dark theme feel */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Platform Capabilities</h2>
              <p className="text-muted-foreground text-lg">
                Comprehensive tools for customer support analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
                  title: "Real-time Analytics",
                  description: "Track ticket patterns, trends, and anomalies across channels and time periods with interactive visualizations.",
                  color: "purple"
                },
                {
                  icon: <Bot className="w-6 h-6 text-cyan-400" />,
                  title: "AI Support Agent",
                  description: "Natural language interface to query ticket data, identify patterns, and receive intelligent recommendations.",
                  color: "cyan"
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6 text-slate-400" />,
                  title: "Automated Reports",
                  description: "Generate comprehensive support audit reports with AI-powered analysis and compliance assessments in seconds.",
                  color: "slate"
                },
                {
                  icon: <Shield className="w-6 h-6 text-emerald-400" />,
                  title: "Customer Intelligence",
                  description: "Monitor customer health across all segments with rich incident mapping and regional analysis.",
                  color: "emerald"
                }
              ].map((feature, i) => {
                // Map colors to tailwind classes for the icon box background
                const colorClasses: Record<string, string> = {
                  purple: "bg-purple-500/10 border-purple-500/20",
                  cyan: "bg-cyan-500/10 border-cyan-500/20",
                  slate: "bg-slate-500/10 border-slate-500/20",
                  emerald: "bg-emerald-500/10 border-emerald-500/20"
                };

                // Map colors to subtle gradient/glow for the card itself
                const cardGlowClasses: Record<string, string> = {
                   purple: "hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)] hover:border-purple-500/30",
                   cyan: "hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)] hover:border-cyan-500/30",
                   slate: "hover:shadow-[0_0_30px_-10px_rgba(148,163,184,0.15)] hover:border-slate-500/30",
                   emerald: "hover:shadow-[0_0_30px_-10px_rgba(52,211,153,0.15)] hover:border-emerald-500/30"
                };

                return (
                  <div key={i} className={`
                    relative overflow-hidden
                    bg-card/30 backdrop-blur-sm 
                    border border-border/50 
                    rounded-2xl p-6 
                    transition-all duration-300 
                    group cursor-default
                    ${cardGlowClasses[feature.color]}
                  `}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${colorClasses[feature.color]} transition-transform group-hover:scale-105`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-foreground/90">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-card border-t border-border py-12 text-sm">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-muted-foreground/20 rounded-md flex items-center justify-center text-xs font-bold text-muted-foreground">ID</div>
            <span className="text-muted-foreground font-medium">© 2026 IntelliDesk AI Inc.</span>
          </div>
          <div className="flex gap-6 text-muted-foreground">
            <Link href="#" className="hover:text-foreground">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
