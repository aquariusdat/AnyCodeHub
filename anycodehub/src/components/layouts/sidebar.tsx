"use client";

import { menuItems } from "@/constants/index"
import MenuItem from "../menuItems";
import logo from "../../../public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
    return (
        <>
            {/* Mobile overlay - only visible when sidebar is expanded on mobile */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`hidden md:flex fixed md:sticky top-0 left-0 h-screen z-20 border-r border-gray-200 dark:border-gray-700 dark:bg-grayDarker bg-white transition-all duration-300 flex flex-col ${isCollapsed ? "w-[90px]" : "w-[280px]"
                    } ${isCollapsed ? "translate-x-0" : "translate-x-0"}`}
            >
                {/* Logo section */}
                <div className="flex items-center h-[72px] p-5">
                    <Link className="flex items-center gap-3 overflow-hidden" href="/">
                        <div className="flex-shrink-0 rounded-full bg-primary min-w-[44px] w-11 h-11 p-1.5 flex items-center justify-center" >
                            <Image
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                }}
                                priority
                                src={logo}
                                alt="AnyCodeHub"
                            />
                        </div>

                        <span className={`text-xl font-bold whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"
                            }`}>
                            anyCodeHub
                        </span>
                    </Link>
                </div>

                <div className={`${isCollapsed ? "overflow-visible" : "overflow-y-auto"} flex-grow px-3 pb-5 pt-3`}>
                    <ul className="flex flex-col gap-2"> 
                        {menuItems.map((item, index) => {
                            return <MenuItem
                                key={index}
                                icon={item.icon}
                                url={item.url}
                                title={item.title}
                                className={item.className}
                                collapsed={isCollapsed}
                            />
                        })}
                    </ul>
                </div>

                {/* Bottom section with collapse button */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <ChevronLeft size={20} />
                                <span className="text-sm">Collapse</span>
                            </div>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;