import * as React from "react";
import Link from "next/link";
import { cn } from "src/lib/utils";
import { useLockBody } from "src/hooks/use-lock-body";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { MessagesSquare, HeartPulse } from "lucide-react";

export function MobileNav() {
  useLockBody();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" width={32} height={32} alt="Logo" className="rounded-full" />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MediMind
          </span>
        </Link>
        
        <nav className="grid gap-4">
          <Link 
            href="/query" 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
          >
            <MessagesSquare className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Medical Queries</span>
          </Link>
          
          <Link 
            href="/support" 
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
          >
            <HeartPulse className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Mental Health Support</span>
          </Link>
        </nav>
        
        <div className="flex justify-start">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}