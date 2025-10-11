"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface openSheetProps {
  content: ReactNode;
  title?: string;
  description?: string;
}
type SheetContextType = {
  open: boolean,
  setOpen:  React.Dispatch<React.SetStateAction<boolean>>
  sheet: (opt: openSheetProps) => void
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<openSheetProps | null>(null);


  const sheet = (options: openSheetProps) => {
    setOptions(options)
    setOpen(true);
  };


  return (
    <SheetContext.Provider value={{ sheet, open, setOpen}}>
      {children}

      {/* Global Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            {options?.title && <SheetTitle>{options.title}</SheetTitle>}
            {options?.description && (
              <SheetDescription>{options.description}</SheetDescription>
            )}
          </SheetHeader>

          <div className="mt-4">{options?.content}</div>
        </SheetContent>
      </Sheet>
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
};
