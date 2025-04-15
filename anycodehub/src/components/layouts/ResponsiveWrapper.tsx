"use client";

import React, { ReactNode } from 'react';

interface ResponsiveWrapperProps {
  children: ReactNode;
  isCollapsed: boolean;
}

const ResponsiveWrapper = ({ children, isCollapsed }: ResponsiveWrapperProps) => {
  return (
    <div
      className={`flex-grow transition-all duration-300 relative `}
    >
      {children}
    </div>
  );
};

export default ResponsiveWrapper; 