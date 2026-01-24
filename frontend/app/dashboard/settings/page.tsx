"use client";

import React from "react";
import { User, Lock, Bell, Globe, Database, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 h-full overflow-y-auto bg-background/50">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
           <p className="text-muted-foreground">Manage your workspace preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Navigation (Mock) */}
            <div className="flex flex-col gap-2">
                {[
                    { icon: User, label: "Account", active: true },
                    { icon: Lock, label: "Security", active: false },
                    { icon: Bell, label: "Notifications", active: false },
                    { icon: Globe, label: "Integrations", active: false },
                    { icon: Database, label: "Data Management", active: false },
                ].map((item, i) => (
                    <button key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Main Content Form */}
            <div className="md:col-span-2 flex flex-col gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <input type="text" className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary" defaultValue="Saurabh" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <input type="text" className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary" defaultValue="Admin" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input type="email" className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary" defaultValue="saurabh@intellidesk.ai" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary h-24" defaultValue="Lead Developer at IntelliDesk AI." />
                        </div>
                    </div>
                     <div className="mt-6 flex justify-end">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">Save Changes</button>
                    </div>
                </div>

                 <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                         <div className="w-10 h-10 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg flex items-center justify-center">
                            <Shield size={20} />
                         </div>
                         <div>
                             <h2 className="text-xl font-semibold">Danger Zone</h2>
                             <p className="text-sm text-muted-foreground">Irreversible actions for your workspace.</p>
                         </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <div>
                            <div className="font-medium text-red-700 dark:text-red-400">Delete Workspace</div>
                            <div className="text-xs text-red-600/80 dark:text-red-400/80">Everything will be permanently removed.</div>
                        </div>
                        <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">Delete Forever</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
