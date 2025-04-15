"use client";

import React, { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  placement?: "top" | "right" | "bottom" | "left";
}

const Tooltip = ({ children, content, placement = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Determine position styles based on placement
  const getPositionStyles = () => {
    switch (placement) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
    }
  };
  
  // Get arrow position styles
  const getArrowStyles = () => {
    switch (placement) {
      case "top":
        return "bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-700 border-r-transparent border-l-transparent border-b-transparent";
      case "right":
        return "left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent";
      case "bottom":
        return "top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-700 border-r-transparent border-l-transparent border-t-transparent";
      case "left":
        return "right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent";
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div 
          className={`absolute z-[9999] ${getPositionStyles()} px-2 py-1 text-sm text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap overflow-hidden shadow-lg`}
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 ${getArrowStyles()}`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;