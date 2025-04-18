"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

interface AuthInitProps {
  children: React.ReactNode;
}

export const AuthInit = ({ children }: AuthInitProps) => {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // Load user data from cookie on initial page load
    setAuth();
  }, [setAuth]);

  return <>{children}</>;
}; 