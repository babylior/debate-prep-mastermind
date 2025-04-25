
import React from 'react';
import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusBarProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  className?: string;
}

export function StatusBar({ status, message, className }: StatusBarProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return (
          <>
            <Loader className="animate-spin h-4 w-4" />
            <span>Saving changes...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span>All changes saved</span>
          </>
        );
      case 'error':
        return <span className="text-red-500">Failed to save changes</span>;
      default:
        return null;
    }
  };

  if (status === 'idle') return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t px-4 py-2 transition-all duration-300 flex items-center justify-center gap-2 text-sm",
      className
    )}>
      {getStatusContent()}
    </div>
  );
}
