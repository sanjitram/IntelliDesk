import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { InboxProvider } from "@/context/InboxContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InboxProvider>
      <div className="flex h-screen w-full font-sans text-foreground overflow-hidden">
        <AppSidebar />
        <div className="flex-1 overflow-hidden h-full relative">
          {children}
        </div>
      </div>
    </InboxProvider>
  );
}
