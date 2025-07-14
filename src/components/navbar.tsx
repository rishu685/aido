import * as React from "react";
import Link from "next/link";
import { MobileNav } from "src/components/mobile-nav";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { GrFormClose } from "react-icons/gr";
import { Menu, Sparkles } from "lucide-react";

export function MainNav() {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <>
      <div className="flex justify-between items-center gap-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-6 lg:px-10 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <Image 
              src="/logo.png" 
              width={40} 
              height={40} 
              alt="Logo" 
              className="relative rounded-full border-2 border-white dark:border-gray-700 shadow-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediMind
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Healthcare AI
            </span>
          </div>
        </Link>

        <button
          className="flex items-center space-x-2 md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? (
            <GrFormClose className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link 
              href="/query" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
            >
              Medical Queries
            </Link>
            <Link 
              href="/support" 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200"
            >
              Mental Health
            </Link>
          </nav>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <ModeToggle />
        </div>
        
        {showMobileMenu && <MobileNav />}
      </div>
    </>
  );
}