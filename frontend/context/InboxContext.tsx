"use client";

import React, { createContext, useContext, useState } from "react";

interface InboxContextType {
  isInboxOpen: boolean;
  toggleInbox: () => void;
  setInboxOpen: (open: boolean) => void;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [isInboxOpen, setInboxOpen] = useState(true);

  const toggleInbox = () => setInboxOpen((prev) => !prev);

  return (
    <InboxContext.Provider value={{ isInboxOpen, toggleInbox, setInboxOpen: (val) => setInboxOpen(val) }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox() {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error("useInbox must be used within an InboxProvider");
  }
  return context;
}
