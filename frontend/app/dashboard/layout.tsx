import React from "react";
import { AppSidebar } from "@/components/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full font-sans text-foreground overflow-hidden">
      <AppSidebar />
      <div className="flex-1 overflow-hidden h-full relative">
        {children}
      </div>
    </div>
  );
}
