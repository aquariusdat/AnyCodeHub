"use client";

import Sidebar from '@/components/layouts/sidebar'
import Header from '@/components/layouts/header'
import React, { useState, useEffect } from 'react'
import { Menu } from "lucide-react";
import ResponsiveWrapper from '@/components/layouts/ResponsiveWrapper';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle mobile sidebar on initial load and resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsCollapsed(true);
            } else {
                setIsMobile(false);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            
            {/* Main content with responsive margin */}
            <ResponsiveWrapper isCollapsed={isCollapsed}>
                <div className="flex flex-col w-full h-screen">
                    <Header />
                    <main className="p-5 h-[calc(100vh-60px)] overflow-auto">
                        {/* Mobile menu toggle button */}
                        {isMobile && isCollapsed && (
                            <button 
                                className="md:hidden fixed bottom-4 right-4 z-20 p-3 rounded-full bg-primary text-white shadow-lg"
                                onClick={toggleSidebar}
                                aria-label="Open menu"
                            >
                                <Menu size={24} />
                            </button>
                        )}
                        
                        {children}
                    </main>
                </div>
            </ResponsiveWrapper>
        </div>
    )
}
export default Layout;
