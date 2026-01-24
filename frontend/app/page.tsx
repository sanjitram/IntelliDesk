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
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

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
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              href="/dashboard"
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
                href="/dashboard" 
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

        {/* Features Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to scale support</h2>
              <p className="text-muted-foreground text-lg">
                Built for modern support teams who demand speed, accuracy, and empathy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-amber-500" />,
                  title: "Instant AI Drafting",
                  description: "Suggested responses generated in milliseconds based on your knowledge base and past tickets."
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
                  title: "Sentiment Analysis",
                  description: "Real-time emotional tracking helps agents prioritize urgent and sensitive customer issues."
                },
                {
                  icon: <Shield className="w-6 h-6 text-green-500" />,
                  title: "Enterprise Grade",
                  description: "SOC2 compliant security with role-based access control and detailed audit logging."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-primary/20 group">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
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
