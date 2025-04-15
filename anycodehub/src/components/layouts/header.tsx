"use client";

import { AuthActions } from "@/components/common";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import logo from "../../../public/images/logo.svg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add scroll event listener to apply shadow and background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <header 
        className={`sticky top-0 z-30 w-full py-3 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 dark:bg-grayDarker/95 backdrop-blur-sm shadow-md" 
            : "bg-white dark:bg-grayDarker"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile menu button - only on small screens */}
          <button 
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Logo - shown on all screen sizes */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="image rounded-full bg-primary size-10 p-1.5" >
                <Image
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                  priority
                  src={logo}
                  alt="AnyCodeHub"
                />
              </div>
              <span className="text-lg font-bold">anyCodeHub</span>
            </Link>
          </div>
          
          {/* Mini logo for mobile */}
          <div className="block md:hidden">
            <Link href="/" className="flex items-center gap-2">
            <div className="image rounded-full bg-primary size-10 p-1.5" >
                <Image
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                  priority
                  src={logo}
                  alt="AnyCodeHub"
                />
              </div>
            </Link>
          </div>
          
          {/* Search box */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses, tutorials..."
                className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Auth actions */}
          <div className="flex items-center">
            <AuthActions />
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Header; 